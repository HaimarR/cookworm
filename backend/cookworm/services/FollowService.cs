using Cookworm.Data;
using Cookworm.Models;
using Cookworm.DTOs;
using System.Linq;

namespace Cookworm.Services
{
    public class FollowService
    {
        private readonly AppDbContext _context;

        public FollowService(AppDbContext context)
        {
            _context = context;
        }

        public bool Follow(Guid followerId, Guid targetId)
        {
            if (followerId == targetId) return false;
            if (_context.Follows.Any(f => f.FollowerId == followerId && f.FollowedId == targetId))
                return false;

            _context.Follows.Add(new Follow
            {
                FollowerId = followerId,
                FollowedId = targetId,
                CreatedAt = DateTime.UtcNow
            });
            _context.SaveChanges();
            return true;
        }

        public bool Unfollow(Guid followerId, Guid targetId)
        {
            var follow = _context.Follows.FirstOrDefault(f => f.FollowerId == followerId && f.FollowedId == targetId);
            if (follow == null) return false;

            _context.Follows.Remove(follow);
            _context.SaveChanges();
            return true;
        }

        public int GetFollowersCount(Guid userId) =>
            _context.Follows.Count(f => f.FollowedId == userId);

        public int GetFollowingCount(Guid userId) =>
            _context.Follows.Count(f => f.FollowerId == userId);

        public bool IsFollowing(Guid followerId, Guid targetId) =>
            _context.Follows.Any(f => f.FollowerId == followerId && f.FollowedId == targetId);

        // ⬇️ NEW: users who follow {userId}
        public List<UserListItemResponse> GetFollowersList(Guid userId)
        {
            var users = (from f in _context.Follows
                         join u in _context.Users on f.FollowerId equals u.Id
                         where f.FollowedId == userId
                         select new { u.Id, u.Username }).ToList();

            var ids = users.Select(u => u.Id).Distinct().ToList();
            var counts = _context.Follows
                .Where(x => ids.Contains(x.FollowedId))
                .GroupBy(x => x.FollowedId)
                .Select(g => new { UserId = g.Key, Count = g.Count() })
                .ToDictionary(x => x.UserId, x => x.Count);

            return users.Select(u => new UserListItemResponse
            {
                Id = u.Id,
                Username = u.Username,
                Followers = counts.TryGetValue(u.Id, out var c) ? c : 0
            }).ToList();
        }

        // ⬇️ NEW: users that {userId} is following
        public List<UserListItemResponse> GetFollowingList(Guid userId)
        {
            var users = (from f in _context.Follows
                         join u in _context.Users on f.FollowedId equals u.Id
                         where f.FollowerId == userId
                         select new { u.Id, u.Username }).ToList();

            var ids = users.Select(u => u.Id).Distinct().ToList();
            var counts = _context.Follows
                .Where(x => ids.Contains(x.FollowedId))
                .GroupBy(x => x.FollowedId)
                .Select(g => new { UserId = g.Key, Count = g.Count() })
                .ToDictionary(x => x.UserId, x => x.Count);

            return users.Select(u => new UserListItemResponse
            {
                Id = u.Id,
                Username = u.Username,
                Followers = counts.TryGetValue(u.Id, out var c) ? c : 0
            }).ToList();
        }
    }
}
