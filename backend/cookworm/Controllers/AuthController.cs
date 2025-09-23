// Controllers/AuthController.cs
using Microsoft.AspNetCore.Mvc;
using Cookworm.Services;
using Cookworm.DTOs;

namespace Cookworm.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var response = await _authService.Login(request);
            if (response == null)
                return Unauthorized("Invalid email or password");

            return Ok(response);
        }
    }
}
