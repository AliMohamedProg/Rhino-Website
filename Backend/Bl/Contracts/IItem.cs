using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Bl.Contracts;
using Bl.DTOs;
using Domains;

namespace BusinessLayer.Contracts
{
    public interface IItem: IBaseService<TbItem,ItemDto>
    {
        bool AddItemWithImagesAndFabrics(ItemDto itemDto);
        bool UpdateItemWithImagesAndFabrics(ItemDto itemDto);
        List<ItemDto> GetAllItemsWithImagesAndFabrics();
        ItemDto? GetItemWithImagesAndFabrics(Guid id);
    }
}
