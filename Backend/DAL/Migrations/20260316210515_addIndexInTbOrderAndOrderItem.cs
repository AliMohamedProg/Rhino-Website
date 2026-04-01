using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DAL.Migrations
{
    /// <inheritdoc />
    public partial class addIndexInTbOrderAndOrderItem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_TbOrder_Status_OrderDate",
                table: "TbOrder",
                columns: new[] { "Status", "OrderDate" });

            migrationBuilder.CreateIndex(
                name: "IX_TbOrder_UserId_OrderDate",
                table: "TbOrder",
                columns: new[] { "UserId", "OrderDate" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_TbOrder_Status_OrderDate",
                table: "TbOrder");

            migrationBuilder.DropIndex(
                name: "IX_TbOrder_UserId_OrderDate",
                table: "TbOrder");
        }
    }
}
