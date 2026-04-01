using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DAL.Migrations
{
    /// <inheritdoc />
    public partial class addSomeColumnsInCartAndCartItem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UnitPrice",
                table: "TbCartItem",
                newName: "Total");

            migrationBuilder.AddColumn<string>(
                name: "MainImage",
                table: "TbItems",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Image",
                table: "TbCartItem",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "NameAr",
                table: "TbCartItem",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "NameEn",
                table: "TbCartItem",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "Price",
                table: "TbCartItem",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MainImage",
                table: "TbItems");

            migrationBuilder.DropColumn(
                name: "Image",
                table: "TbCartItem");

            migrationBuilder.DropColumn(
                name: "NameAr",
                table: "TbCartItem");

            migrationBuilder.DropColumn(
                name: "NameEn",
                table: "TbCartItem");

            migrationBuilder.DropColumn(
                name: "Price",
                table: "TbCartItem");

            migrationBuilder.RenameColumn(
                name: "Total",
                table: "TbCartItem",
                newName: "UnitPrice");
        }
    }
}
