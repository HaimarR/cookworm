using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace Cookworm.Models
{
    public enum UserRole
    {
        Regular,
        ContentCreator,
        Chef,
        Moderator
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

        [MaxLength(500)]
        public string? Bio { get; set; }

        [MaxLength(100)]
        public string? Location { get; set; }

        // Navigation for following system
        public ICollection<Follow> Followers { get; set; } = new List<Follow>();
        public ICollection<Follow> Following { get; set; } = new List<Follow>();
    }
}
