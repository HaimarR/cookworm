// Models/User.cs
using System;
using System.ComponentModel.DataAnnotations;

namespace Cookworm.Models
{
    public enum UserRole
    {
        Regular,
        ContentCreator,
        Chef
    }

    public class User
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required, MaxLength(100)]
        public string Username { get; set; } = string.Empty;

        [Required, MaxLength(255)]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        public UserRole Role { get; set; } = UserRole.Regular;
    }
}
