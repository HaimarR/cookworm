using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Cookworm.Services;
using Cookworm.DTOs;

namespace Cookworm.Controllers
{
    [ApiController]
    [Route("api/profile/{username}")]
    public class ProfileController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly FollowService _followService;

        public ProfileController(UserService userService, FollowService followService)
        {
            _userService = userService;
            _followService = followService;
        }

        private bool TryGetUserId(out Guid userId)
        {
            userId = Guid.Empty;
            string? val =
                User.FindFirst("sub")?.Value ??
                User.FindFirst(ClaimTypes.NameIdentifier)?.Value ??
                User.FindFirst("userId")?.Value;
            return Guid.TryParse(val, out userId);
        }

        // GET /api/profile/{username}
        // Public; includes Email only when viewer is the owner.
        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetProfile(string username)
        {
            var user = _userService.GetUserByUsername(username);
            if (user == null) return NotFound();

            var isOwner = TryGetUserId(out var viewerId) && viewerId == user.Id;

            var dto = new UserResponse
            {
                Id = user.Id,
                Username = user.Username,
                Bio = user.Bio,
                Location = user.Location,
                Email = isOwner ? user.Email : null,
                Followers = _followService.GetFollowersCount(user.Id)
            };

            return Ok(dto);
        }

        // GET /api/profile/{username}/stats
        [HttpGet("stats")]
        [AllowAnonymous]
        public IActionResult GetStats(string username)
        {
            var target = _userService.GetUserByUsername(username);
            if (target == null) return NotFound();

            var hasViewer = TryGetUserId(out var viewerId);

            var stats = new FollowResponse
            {
                UserId = target.Id,
                FollowersCount = _followService.GetFollowersCount(target.Id),
                FollowingCount = _followService.GetFollowingCount(target.Id),
                IsFollowing = hasViewer && _followService.IsFollowing(viewerId, target.Id)
            };
            return Ok(stats);
        }

        // GET /api/profile/{username}/followers
        [HttpGet("followers")]
        [AllowAnonymous]
        public IActionResult GetFollowers(string username)
        {
            var target = _userService.GetUserByUsername(username);
            if (target == null) return NotFound();

            var list = _followService.GetFollowersList(target.Id);
            return Ok(list);
        }

        // GET /api/profile/{username}/following
        [HttpGet("following")]
        [AllowAnonymous]
        public IActionResult GetFollowing(string username)
        {
            var target = _userService.GetUserByUsername(username);
            if (target == null) return NotFound();

            var list = _followService.GetFollowingList(target.Id);
            return Ok(list);
        }

        // POST /api/profile/{username}/follow
        [HttpPost("follow")]
        [Authorize]
        public IActionResult Follow(string username)
        {
            if (!TryGetUserId(out var viewerId)) return Unauthorized();

            var target = _userService.GetUserByUsername(username);
            if (target == null) return NotFound("User not found.");

            var ok = _followService.Follow(viewerId, target.Id);
            if (!ok) return BadRequest("Could not follow user.");
            return Ok();
        }

        // POST /api/profile/{username}/unfollow
        [HttpPost("unfollow")]
        [Authorize]
        public IActionResult Unfollow(string username)
        {
            if (!TryGetUserId(out var viewerId)) return Unauthorized();

            var target = _userService.GetUserByUsername(username);
            if (target == null) return NotFound("User not found.");

            var ok = _followService.Unfollow(viewerId, target.Id);
            if (!ok) return BadRequest("Could not unfollow user.");
            return Ok();
        }

        // PUT /api/profile/{username}
        // Auth required; only the owner can update.
        [HttpPut]
        [Authorize]
        public IActionResult UpdateProfile(string username, [FromBody] UserRequest request)
        {
            if (!TryGetUserId(out var viewerId)) return Unauthorized();

            var target = _userService.GetUserByUsername(username);
            if (target == null) return NotFound("User not found.");

            if (target.Id != viewerId)
                return Forbid("You can only edit your own profile.");

            var updated = _userService.UpdateUser(target.Id, request);
            if (updated == null)
                return Conflict("Username or email already in use.");

            var response = new UserResponse
            {
                Id = updated.Id,
                Username = updated.Username,
                Bio = updated.Bio,
                Location = updated.Location,
                Email = updated.Email, // owner sees their own email
                Followers = _followService.GetFollowersCount(updated.Id)
            };

            return Ok(response);
        }
    }
}
