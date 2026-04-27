using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DAL.Migrations
{
    /// <inheritdoc />
    public partial class CreateTbStyles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "StyleId",
                table: "TbItems",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "TbStylesId",
                table: "TbItems",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "TbStyles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    NameAr = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NameEn = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ProductsCount = table.Column<int>(type: "int", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CurrentState = table.Column<int>(type: "int", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TbStyles", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TbItems_TbStylesId",
                table: "TbItems",
                column: "TbStylesId");

            migrationBuilder.AddForeignKey(
                name: "FK_TbItems_TbStyles_TbStylesId",
                table: "TbItems",
                column: "TbStylesId",
                principalTable: "TbStyles",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TbItems_TbStyles_TbStylesId",
                table: "TbItems");

            migrationBuilder.DropTable(
                name: "TbStyles");

            migrationBuilder.DropIndex(
                name: "IX_TbItems_TbStylesId",
                table: "TbItems");

            migrationBuilder.DropColumn(
                name: "StyleId",
                table: "TbItems");

            migrationBuilder.DropColumn(
                name: "TbStylesId",
                table: "TbItems");
        }
    }
}
