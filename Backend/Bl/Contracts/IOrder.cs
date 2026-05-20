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
    public interface IOrder: IBaseService<TbOrder,OrderDto>
    {
        Task<TbOrder> CreateOrder(Guid userId,OrderRequest orderRequest);
        Task<List<OrderDto>> GetUserOrders(Guid userId);
        Task<OrderDto> GetOrderById(Guid id);
        Task<List<OrderDto>> GetAllOrders();
        Task<bool> UpdateOrderStatus(Guid orderId, string status);
        Task<bool> UpdateOrderPaymentStatus(Guid orderId, string transactionId, string status);
        Task MarkOrderAsPaid(Guid orderId, string transactionId);
    }
}
