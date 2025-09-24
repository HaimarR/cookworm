namespace Cookworm.DTOs
{
    public class FollowResponse
    {
        public Guid UserId { get; set; }
        public int FollowersCount { get; set; }
        public int FollowingCount { get; set; }
        public bool IsFollowing { get; set; }
    }
}
