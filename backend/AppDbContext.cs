using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<TimeCapsule> Capsules => Set<TimeCapsule>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("users");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Email).HasColumnName("email");
            entity.Property(e => e.Password).HasColumnName("password");
        });

        modelBuilder.Entity<TimeCapsule>(entity =>
        {
            entity.ToTable("capsules");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Title).HasColumnName("title");
            entity.Property(e => e.Message).HasColumnName("message");
            entity.Property(e => e.DeliveryDate).HasColumnName("delivery_date");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(c => c.User)
                .WithMany(u => u.Capsules)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }

}

public class User
{
    public int Id { get; set; }
    public string? Email { get; set; }
    public string? Password { get; set; }

    public List<TimeCapsule> Capsules { get; set; } = new();
}

public class TimeCapsule
{
    public int Id { get; set; }
    public string Title { get; set; } = "Unlabeled";
    public string Message { get; set; } = string.Empty;

    private DateTime _deliveryDate;
    public DateTime DeliveryDate
    {
        get => _deliveryDate;
        set => _deliveryDate = DateTime.SpecifyKind(value, DateTimeKind.Utc);
    }

    private DateTime _createdAt = DateTime.UtcNow;
    public DateTime CreatedAt
    {
        get => _createdAt;
        set => _createdAt = DateTime.SpecifyKind(value, DateTimeKind.Utc);
    }

    public int UserId { get; set; }
    public User User { get; set; } = null!;
}