namespace Cookworm.DTOs
{
    public class UserListItemResponse
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public int Followers { get; set; }
    }
}
