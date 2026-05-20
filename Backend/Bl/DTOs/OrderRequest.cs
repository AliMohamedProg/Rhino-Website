using System.ComponentModel.DataAnnotations;

namespace Bl.DTOs;

public class OrderRequest
{
    //Guid userId,-
    //string Country,-
    //string paymentMethodName,-
    //string City,-
    //string Address,-
    //decimal Total,-
    //string PhoneNumber,-
    //string Email,-
    //string FirstName,-
    //string LastName,-
    //string? transactionId = null
    public string Country { get; set; } = "Egypt";
    [Required(ErrorMessage = "Payment Method Name is required")]
    public string PaymentMethodName { get; set; }
    [Required(ErrorMessage = "City is required")]
    public string City { get; set; }
    [Required(ErrorMessage = "User ID is required")]
    public Guid UserId { get; set; }
    [Required(ErrorMessage = "Address is required")]
    public string Address { get; set; }
    [Required(ErrorMessage = "Total is required")]
    public decimal Total { get; set; }
    [Phone(ErrorMessage = "Phone Number is required")]
    [MaxLength(11, ErrorMessage = "Phone Number is too long")]
    public string PhoneNumber { get; set; }
    [Required(ErrorMessage = "Email is required")]
    public string Email { get; set; }
    [Required(ErrorMessage = "FirstName is required")]
    public string FirstName { get; set; }
    [Required(ErrorMessage = "LastName is required")]
    public string LastName { get; set; }
    public string? TransactionId { get; set; }
}