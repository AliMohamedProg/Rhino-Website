using System;
using System.Collections.Generic;
using System.Text;

namespace Bl.DTOs
{
    public class OrderDto : BaseDto
    {
        public Guid UserId { get; set; }

        public DateTime OrderDate { get; set; }

        public string Status { get; set; } = null!;

        public string PaymentStatus { get; set; } = null!;

        public string PaymobTransactionId { get; set; } = null!;

    }
}
