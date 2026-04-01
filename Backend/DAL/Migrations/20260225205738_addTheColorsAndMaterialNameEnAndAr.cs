using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DAL.Migrations
{
    /// <inheritdoc />
    public partial class addTheColorsAndMaterialNameEnAndAr : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Colors",
                table: "TbItems");

            migrationBuilder.DropColumn(
                name: "Material",
                table: "TbItems");

            migrationBuilder.AddColumn<string>(
                name: "ColorsAr",
                table: "TbItems",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ColorsEn",
                table: "TbItems",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MaterialAr",
                table: "TbItems",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MaterialEn",
                table: "TbItems",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ColorsAr",
                table: "TbItems");

            migrationBuilder.DropColumn(
                name: "ColorsEn",
                table: "TbItems");

            migrationBuilder.DropColumn(
                name: "MaterialAr",
                table: "TbItems");

            migrationBuilder.DropColumn(
                name: "MaterialEn",
                table: "TbItems");

            migrationBuilder.AddColumn<string>(
                name: "Colors",
                table: "TbItems",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Material",
                table: "TbItems",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
