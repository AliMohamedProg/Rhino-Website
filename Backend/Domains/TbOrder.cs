using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Domains;

public partial class TbOrder : BaseTable
{
 

    public Guid UserId { get; set; }
    public DateTime OrderDate { get; set; }
    public DateTime DelivryDate { get; set; }
    public string Country { get; set; }
    public string City { get; set; }
    public string Address { get; set; }
    public decimal Total { get; set; }
    [Phone(ErrorMessage = "the phone number is invalid")]
    [MaxLength(11, ErrorMessage = "the phone number must be 11 digits and start with zero")]
    public string PhoneNumber { get; set; }
    [EmailAddress(ErrorMessage = "the email is invalid")]
    public string Email { get; set; }
    public string OrderNumber { get; set; }
    public string Status { get; set; } = null!;
    [MaxLength(50, ErrorMessage = "the first name must be less than 50 characters")]
    public string FirstName { get; set; } = null!;
    [MaxLength(50, ErrorMessage = "the first name must be less than 50 characters")]
    public string LastName { get; set; } = null!;
    public string PaymentStatus { get; set; } = null!;
    public string PaymentMethodName { get; set; } = null!;

    public string? PaymobTransactionId { get; set; } = null!;

    public virtual ICollection<TbOrderItem> TbOrderItems { get; set; } = new List<TbOrderItem>();
}
