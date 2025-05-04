using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors();
//builder.Services.AddDbContext<AppDbContext>(options =>
//    options.UseNpgsql("Host=localhost;Port=5433;Database=timecapsule;Username=postgres;Password=password")
//);

var app = builder.Build();

// For dev only
app.UseCors(policy => 
    policy.AllowAnyOrigin()
    .AllowAnyHeader()
    .AllowAnyMethod()
);

// POST to save registered user
app.MapPost("/register", (UserDto user) =>
{
    if(!isUserValid(user.Email, user.Password)) {
        return Results.BadRequest("User password or email is invalid");
    }

    user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);

    Console.WriteLine($"Email: {user.Email}, Password: {user.Password}");
    return Results.Ok(new { message = "User registered", user });
});

app.Run();

bool isUserValid(string email, string password) {
    return true;
}

public class UserDto
{
    public required  string Email { get; set; }
    public required  string Password { get; set; }
}
