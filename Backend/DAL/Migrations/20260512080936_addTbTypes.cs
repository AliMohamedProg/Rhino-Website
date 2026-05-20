using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DAL.Migrations
{
    /// <inheritdoc />
    public partial class addTbTypes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "TypeId",
                table: "TbItems",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "TbTypes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CurrentState = table.Column<int>(type: "int", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TbTypes", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TbItems_TypeId",
                table: "TbItems",
                column: "TypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_TbItems_TbTypes_TypeId",
                table: "TbItems",
                column: "TypeId",
                principalTable: "TbTypes",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TbItems_TbTypes_TypeId",
                table: "TbItems");

            migrationBuilder.DropTable(
                name: "TbTypes");

            migrationBuilder.DropIndex(
                name: "IX_TbItems_TypeId",
                table: "TbItems");

            migrationBuilder.DropColumn(
                name: "TypeId",
                table: "TbItems");
        }
    }
}
