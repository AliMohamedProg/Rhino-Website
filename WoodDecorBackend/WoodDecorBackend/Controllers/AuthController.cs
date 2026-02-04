using System.Security.Claims;
using Apis.Services;
using Azure.Core;
using Bl.Contracts;
using Bl.DTOs;
using Bl.Services;
using BusinessLayer.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;


namespace Apis.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly TokenService _tokenService;
        private readonly IUserService _userService;
        private readonly IRefreshTokens _RefreshTokenService;
        public AuthController(TokenService tokenService,
                              IUserService userService,
                              IRefreshTokens refreshTokenService)
        {
            _tokenService = tokenService;
            _userService = userService;
            _RefreshTokenService = refreshTokenService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserDto request)
       {
            var result = await _userService.RegisterAsync(request);

            if (!result.Success)
                return BadRequest(result.Errors);

            return Ok(new { message = "User registered successfully" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto request)
        {
            var userResult = await _userService.LoginAsync(request);
            if (!userResult.Success)
            {
                return Unauthorized("Invalid credentials");
            }


            var userData = await GetClims(request.Email);
            var claims = userData.Item1;
            UserDto user = userData.Item2;
            var accessToken = _tokenService.GenerateAccessToken(claims);
            var refreshToken = _tokenService.GenerateRefreshToken();

            var storedToken = new RefreshTokensDto
            {
                Token = refreshToken,
                UserId = user.Id.ToString(),
                Expires = DateTime.UtcNow.AddDays(7),
                CurrentState = 1
            };

            await _RefreshTokenService.Refresh(storedToken);

            Response.Cookies.Append("AccessToken", accessToken, new CookieOptions
            {
                HttpOnly = true,
                Secure =true,
                SameSite = SameSiteMode.None,
                Path = "/",
                Expires = DateTimeOffset.UtcNow.AddMinutes(15)
            });

            Response.Cookies.Append("RefreshToken", refreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Path = "/",
                Expires = storedToken.Expires
            });

            return Ok(new { AccessToken = accessToken, RefreshToken = refreshToken });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _userService.LogoutAsync();
            return Ok(new { Message = "Logged out successfully" });
        }

        //[Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> Me()
         {
            // Get the username (Name claim)
            var userName = User.Identity.Name;

            // Get the user ID (NameIdentifier claim)
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Get the user role
            var IsUser = User.IsInRole("User");

            // Check if the user is authenticated
            if (User.Identity.IsAuthenticated)
            {
                return Ok(new { UserId = userId, UserName = userName, IsAuthenticated = true , IsUser});
            }
            else
            {
                return Unauthorized();
            }
        }

        [HttpPost("RefreshAccessToken")]
        public async Task<IActionResult> RefreshAccessToken()
        {
            if (!Request.Cookies.TryGetValue("RefreshToken", out var refreshToken))
            {
                return Unauthorized("No refresh token found");
            }

            // Retrieve the refresh token from the database
            var storedToken = _RefreshTokenService.GetByRefreshToken(refreshToken);
            if (storedToken == null || storedToken.CurrentState == 2 || storedToken.Expires < DateTime.UtcNow)
            {
                return Unauthorized("Invalid or expired refresh token");
            }

            // Generate a new access token
            var claims = await GetClimsById(storedToken.UserId);

            var newAccessToken = _tokenService.GenerateAccessToken(claims);

            Response.Cookies.Append("AccessToken", newAccessToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddMinutes(5)  // Adjust token expiry based on your needs
            });

            return Ok(new { AccessToken = newAccessToken });
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh()
        {
            if (!Request.Cookies.TryGetValue("RefreshToken", out var refreshToken))
            {
                return Unauthorized("No refresh token found");
            }

            // Retrieve the refresh token from the database
            var storedToken = _RefreshTokenService.GetByRefreshToken(refreshToken);
            if (storedToken == null || storedToken.CurrentState == 2 || storedToken.Expires < DateTime.UtcNow)
            {
                return Unauthorized("Invalid or expired refresh token");
            }

            // Generate a new refresh token
            var newRefreshToken = _tokenService.GenerateRefreshToken();
            var newRefreshDto = new RefreshTokensDto
            {
                Token = newRefreshToken,
                UserId = storedToken.UserId,
                Expires = DateTime.UtcNow.AddDays(7),
                CurrentState = 1
            };
            await _RefreshTokenService.Refresh(newRefreshDto);

            // Set the new refresh token in the cookies
            Response.Cookies.Append("RefreshToken", newRefreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                Expires = DateTime.UtcNow.AddDays(7)
            });

            return Ok(new { RefreshToken = newRefreshToken });
        }

        async Task<(Claim[], UserDto)> GetClims(string email)
        {
            var user = await _userService.GetUserByEmailAsync(email);
            var claims = new[] {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Email),
                new Claim(ClaimTypes.Role, "User")
            };

            return (claims, user);
        }

        async Task<Claim[]> GetClimsById(string userId)
        {
            var user = await _userService.GetUserByIdAsync(userId);

            var claims = new[] {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Email),
                new Claim(ClaimTypes.Role, "User")
            };

            return claims;
        }
    }
}
