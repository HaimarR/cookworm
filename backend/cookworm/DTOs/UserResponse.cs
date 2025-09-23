namespace Cookworm.DTOs
{
    public class UserResponse
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Bio { get; set; }
        public string? Location { get; set; }
        public int Followers { get; set; } = 0;
    }
}
