using System.ComponentModel.DataAnnotations;

namespace Bl.DTOs
{
    public class PaymentRequest
    {
        public int Amount { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        [Phone]
        [Required]
        [MaxLength(11)]
        public string PhoneNumber { get; set; }

        public string OrderId { get; set; }
        public string PaymentMethod { get; set; }   

    }
}
