using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql("Host=postgres;Port=5432;Database=timecapsule;Username=postgres;Password=password")
);

var app = builder.Build();

// For dev only
app.UseCors(policy => 
    policy.AllowAnyOrigin()
    .AllowAnyHeader()
    .AllowAnyMethod()
);

// POST to save registered user
app.MapPost("/register", async ([FromBody] UserDto user, [FromServices] AppDbContext db) =>
{
    var newUser = new User
    {
        Email = user.Email,
        Password = BCrypt.Net.BCrypt.HashPassword(user.Password)
    };

    db.Users.Add(newUser);
    await db.SaveChangesAsync();

    return Results.Ok(new { message = "User registered", id = newUser.Id });
});
app.MapPost("/login", async ([FromBody] UserDto dto, [FromServices] AppDbContext db) =>
{
    var user = await db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
    if (user is null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.Password))
    {
        return Results.Unauthorized();
    }
    
    return Results.Ok(new { message = "Login successfull", id = user.Id});
});
app.MapPost("/load-capsules", async ([FromBody] UserDto userDto, [FromServices] AppDbContext db) => {
    var user = await db.Users
        .Include(u => u.Capsules)
        .FirstOrDefaultAsync(u => u.Email == userDto.Email);

    if (user is null || !BCrypt.Net.BCrypt.Verify(userDto.Password, user.Password))
        return Results.Unauthorized();
    
    return Results.Ok(user.Capsules.Select(c => new {
        c.Title,
        c.Message,
        deliveryDate = c.DeliveryDate.ToString("yyyy-MM-dd"),
        created_at = c.CreatedAt.ToString("yyyy-MM-dd")
    }));
});
app.MapPost("/capsule", async ([FromBody] CapsuleDto capsule, [FromServices] AppDbContext db) =>
{
    var newCapsule = new TimeCapsule {
        Title = capsule.Title,
        Message = capsule.Message,
        DeliveryDate = capsule.DeliveryDate,
        CreatedAt = capsule.CreatedAt,
        UserId = capsule.UserId
    };
    db.Capsules.Add(newCapsule);
    await db.SaveChangesAsync();

    return Results.Ok(newCapsule);
});

app.MapDelete("/delete-capsule", async ([FromBody] CapsuleDto capsuleToDelete, [FromServices] AppDbContext db) => {
    var capsule = await db.Capsules.FirstOrDefaultAsync(c => 
        c.Title == capsuleToDelete.Title &&
        c.Message == capsuleToDelete.Message &&
        c.DeliveryDate == capsuleToDelete.DeliveryDate &&
        c.CreatedAt == capsuleToDelete.CreatedAt &&
        c.UserId == capsuleToDelete.UserId
    );

    if (capsule is null)
    {
        return Results.NotFound(new { message = "Capsule is not found" });
    }

    db.Capsules.Remove(capsule);
    await db.SaveChangesAsync();

    return Results.Ok(new { message = "Capsule successfully deleted" });
});

app.Run();

public class UserDto
{
    public required string Email { get; set; }
    public required string Password { get; set; }
}

public class CapsuleDto
{
    public string Title { get; set; } = "Unlabeled";
    public string Message { get; set; } = string.Empty;
    public DateTime DeliveryDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int UserId { get; set; }
}