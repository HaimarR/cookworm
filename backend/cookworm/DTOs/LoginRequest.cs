namespace Cookworm.DTOs
{
    public class LoginRequest
    {
        public string Identifier { get; set; } = string.Empty; // username or email
        public string Password { get; set; } = string.Empty;
        public bool RememberMe { get; set; } = false;
    }
}