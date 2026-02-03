using System.ComponentModel.DataAnnotations;

namespace Bl.DTOs
{
    public class UserDto : BaseDto
    {
        [Required(ErrorMessage = "First name is required")]
        [StringLength(50, ErrorMessage = "First name must be less than 50 characters")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "Last name is required")]
        [StringLength(50, ErrorMessage = "Last name must be less than 50 characters")]
        public string LastName { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [StringLength(100, MinimumLength = 8, ErrorMessage = "Password must be between 8 and 100 characters")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Confirm password is required")]
        [Compare("Password", ErrorMessage = "Passwords do not match")]
        public string ConfirmPassword { get; set; }

        [Required(ErrorMessage = "Phone number is required")]
        [Phone(ErrorMessage = "Invalid phone number")]
        public string PhoneNumber { get; set; }
        public string? Role { get; set; }
        public string? ReturnUrl { get; set; }
    }
}
