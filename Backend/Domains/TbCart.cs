using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Domains;

public partial class TbCart : BaseTable
{   
    [Required]
    public Guid UserId { get; set; }
    public ICollection<TbCartItem> Items { get; set; } = new List<TbCartItem>();
}
