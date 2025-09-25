using Microsoft.EntityFrameworkCore;
using Cookworm.Models;

namespace Cookworm.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

        public DbSet<User> Users { get; set; }
        public DbSet<Follow> Follows { get; set; }
        public DbSet<Post> Posts { get; set; }   // ✅ Added

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Users mapping
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users");
                entity.Property(u => u.Id).HasColumnName("id");
                entity.Property(u => u.Username).HasColumnName("username");
                entity.Property(u => u.Email).HasColumnName("email");
                entity.Property(u => u.PasswordHash).HasColumnName("password_hash");
                entity.Property(u => u.CreatedAt).HasColumnName("created_at");
                entity.Property(u => u.Role).HasColumnName("role");
                entity.Property(u => u.Bio).HasColumnName("bio");
                entity.Property(u => u.Location).HasColumnName("location");
            });

            // Follows mapping
            modelBuilder.Entity<Follow>(entity =>
            {
                entity.ToTable("follows");
                entity.HasKey(f => new { f.FollowerId, f.FollowedId });

                entity.Property(f => f.FollowerId).HasColumnName("follower_id");
                entity.Property(f => f.FollowedId).HasColumnName("followed_id");
                entity.Property(f => f.CreatedAt).HasColumnName("created_at");

                entity.HasOne(f => f.Follower)
                    .WithMany(u => u.Following)
                    .HasForeignKey(f => f.FollowerId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(f => f.Followed)
                    .WithMany(u => u.Followers)
                    .HasForeignKey(f => f.FollowedId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Posts mapping
            modelBuilder.Entity<Post>(entity =>
            {
                entity.ToTable("posts");
                entity.HasKey(p => p.Id);

                entity.Property(p => p.Id).HasColumnName("id");
                entity.Property(p => p.UserId).HasColumnName("user_id");
                entity.Property(p => p.Caption).HasColumnName("caption");
                entity.Property(p => p.ImageUrl).HasColumnName("image_url");
                entity.Property(p => p.CreatedAt).HasColumnName("created_at");

                // Optional: navigation to User
                entity.HasOne<User>()
                      .WithMany()
                      .HasForeignKey(p => p.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
