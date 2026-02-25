using Bl.DTOs;

namespace Bl.Contracts
{
    public interface IPaymobPayment
    {
        Task<PaymobPaymentResult> CreatePayment(
            int amount,
            string email,
            string firstName,
            string lastName,
            string phone,
            string orderId,
            string paymentMethod);
        Task MarkOrderAsPaid(Guid orderId);
    }
}
