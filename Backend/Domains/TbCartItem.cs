using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Domains;

public class TbCartItem : BaseTable
{
    public Guid CartId { get; set; }

    public Guid ItemId { get; set; }

    public int StockNumber { get; set; }
    [Column(TypeName = "decimal(18,2)")]
    public decimal Total { get; set; }
    public string NameAr { get; set; }
    public string NameEn { get; set; }
    public string Image { get; set; }
    public string Color { get; set; }
    public decimal Price { get; set; }
    public Guid UserId { get; set; }

    // Navigation
    [ForeignKey(nameof(CartId))]
    public TbCart Cart { get; set; }

    [ForeignKey(nameof(ItemId))]
    public TbItem Item { get; set; }
}
