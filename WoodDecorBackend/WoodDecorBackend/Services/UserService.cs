using System.Data;
using System.Security.Claims;
using Bl.Contracts;
using Bl.DTOs;
using DAL.UserModel;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Apis.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public UserService(UserManager<ApplicationUser> _userManager, SignInManager<ApplicationUser> _signInManager,
                          IHttpContextAccessor httpContextAccessor)
        {
            this._userManager = _userManager;
            this._signInManager = _signInManager;
            _httpContextAccessor = httpContextAccessor;
        }
        public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
        {
            var users = _userManager.Users;
            return users.Select(u => new UserDto
            {
                Id = Guid.Parse(u.Id),
                Email = u.Email,
            });
        }

        public Guid GetLoggedInUser()
        {
            try
            {
                var userId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
                return Guid.Parse(userId);
            }
            catch
            {
                return Guid.Empty; // or throw an exception, depending on your needs
            }
        }


        public async Task<UserDto> GetUserByEmailAsync(string Email)
        {
            var user = await _userManager.FindByEmailAsync(Email);
            if (user == null)
            {
                return null;
            }
            var roles = await _userManager.GetRolesAsync(user);

            return new UserDto
            {
                Id = Guid.Parse(user.Id),
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                PhoneNumber = user.PhoneNumber,
                Role = roles.FirstOrDefault()
            };
        }

        public async Task<UserDto> GetUserByIdAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return null;
            }
            var roles = await _userManager.GetRolesAsync(user);

            return new UserDto
            {
                Id = Guid.Parse(user.Id),
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                PhoneNumber = user.PhoneNumber,
                Role = roles.FirstOrDefault()
            };
        }

        public async Task<UserResultDto> LoginAsync(LoginDto loginDto)
        {
            var result = await _signInManager.PasswordSignInAsync(loginDto.Email, loginDto.Password, true, false);

            if (!result.Succeeded)
            {
                return new UserResultDto
                {
                    Success = false,
                    Errors = new[] { "Invalid login attempt." }
                };
            }


            // Generate token (if needed) or return success
            return new UserResultDto { Success = true};
        }

        public async Task LogoutAsync()
        {
            await _signInManager.SignOutAsync();
        }

        public async Task<UserResultDto> RegisterAsync(UserDto registerDto)
        {
            // 1. التأكد من تطابق كلمة المرور
            if (registerDto.Password != registerDto.ConfirmPassword)
            {
                return new UserResultDto { Success = false, Errors = new[] { "Passwords do not match." } };
            }

            var user = new ApplicationUser
            {
                UserName = registerDto.Email,
                Email = registerDto.Email,
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                PhoneNumber = registerDto.PhoneNumber
            };

            // 2. محاولة إنشاء المستخدم أولاً
            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (result.Succeeded)
            {
                // 3. لن يتم الدخول هنا إلا إذا أصبح للمستخدم ID حقيقي في الداتابيز
                var registerName = (string.IsNullOrEmpty(registerDto.Role)) ? "User" : registerDto.Role;

                // تأكد من أن الـ Role موجودة أصلاً (كما فعلنا في الـ Seed)
                var roleResult = await _userManager.AddToRoleAsync(user, registerName);

                if (!roleResult.Succeeded)
                {
                    return new UserResultDto
                    {
                        Success = false,
                        Errors = roleResult.Errors.Select(e => e.Description)
                    };
                }

                return new UserResultDto { Success = true };
            }

            // 4. في حال فشل الـ CreateAsync (مثلاً Password Validation)
            return new UserResultDto
            {
                Success = false,
                Errors = result.Errors.Select(e => e.Description)
            };
        }
    }
}
