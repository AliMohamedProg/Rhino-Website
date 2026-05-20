using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Domains;

public class TbCartCollection : BaseTable
{
    public Guid CartId { get; set; }

    public Guid CollectionId { get; set; }

    public int Quantity { get; set; }
    [Column(TypeName = "decimal(18,2)")]
    public decimal Total { get; set; }
    public string Name { get; set; }
    public string Image { get; set; }
    public string? Color { get; set; }
    public string? Fabric { get; set; }
    public decimal Price { get; set; }
    public Guid UserId { get; set; }

    // Navigation
    [ForeignKey(nameof(CartId))]
    public TbCart Cart { get; set; }
    public TbCollections Collection { get; set; }
    
}
