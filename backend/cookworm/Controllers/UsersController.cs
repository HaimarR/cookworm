using Microsoft.AspNetCore.Mvc;
using Cookworm.Services;
using Cookworm.DTOs;

namespace Cookworm.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly UserService _userService;

        public UsersController(UserService userService)
        {
            _userService = userService;
        }

        [HttpPost("signup")]
        public IActionResult SignUp([FromBody] SignUpRequest request)
        {
            var user = _userService.SignUp(request);
            if (user == null)
                return BadRequest("Email already in use.");

            return Ok(new { user.Id, user.Username, user.Email });
        }
    }
}
