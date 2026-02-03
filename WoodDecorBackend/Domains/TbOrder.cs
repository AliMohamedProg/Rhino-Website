using System;
using System.Collections.Generic;

namespace Domains;

public partial class TbOrder : BaseTable
{
 

    public Guid UserId { get; set; }

    public DateTime OrderDate { get; set; }

    public string Status { get; set; } = null!;

    public string PaymentStatus { get; set; } = null!;

    public string PaymobTransactionId { get; set; } = null!;

    public virtual ICollection<TbOrderItem> TbOrderItems { get; set; } = new List<TbOrderItem>();
}
