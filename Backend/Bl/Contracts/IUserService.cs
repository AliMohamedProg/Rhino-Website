using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Bl.DTOs;

namespace Bl.Contracts
{
    public interface IUserService
    {
        Task<UserResultDto> RegisterAsync(UserDto registerDto);
        Task<UserResultDto> LoginAsync(LoginDto loginDto);
        Task LogoutAsync();
        Task<UserDto> GetUserByIdAsync(string userId);
        Task<UserDto> GetUserByEmailAsync(string Email);
        Task<IEnumerable<UserDto>> GetAllUsersAsync();
        Guid GetLoggedInUser();

    }
}
