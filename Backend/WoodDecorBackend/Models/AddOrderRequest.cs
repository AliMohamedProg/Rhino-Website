using System.ComponentModel.DataAnnotations;

namespace Apis.Models
{
    public class AddOrderRequest
    {
        public string Country { get; set; }
        public string City { get; set; }
        public string Address { get; set; }
        public decimal Total { get; set; }
        [Phone(ErrorMessage = "the phone number is invalid")]
        [MaxLength(11, ErrorMessage = "the phone number must be 11 digits and start with zero")]
        public string PhoneNumber { get; set; }
        [EmailAddress(ErrorMessage = "the email is invalid")]
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PaymentMethodName { get; set; }
        public string? TransactionId { get; set; }
    }
}
