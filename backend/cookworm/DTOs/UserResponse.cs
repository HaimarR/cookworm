using System.Text.Json.Serialization;

namespace Cookworm.DTOs
{
    public class UserResponse
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = string.Empty;

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? Email { get; set; }   // null for non-owners

        public string? Bio { get; set; }
        public string? Location { get; set; }
        public int Followers { get; set; } = 0; // we'll populate this
    }
}
