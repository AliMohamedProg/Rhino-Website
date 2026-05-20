using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DAL.Migrations
{
    /// <inheritdoc />
    public partial class PendingChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NameAr",
                table: "TbStyles");

            migrationBuilder.DropColumn(
                name: "TitleAr",
                table: "TbSliders");

            migrationBuilder.DropColumn(
                name: "nameAr",
                table: "TbOrderItems");

            migrationBuilder.DropColumn(
                name: "ColorsAr",
                table: "TbItems");

            migrationBuilder.DropColumn(
                name: "ColorsEn",
                table: "TbItems");

            migrationBuilder.DropColumn(
                name: "DescriptionAr",
                table: "TbItems");

            migrationBuilder.DropColumn(
                name: "NameAr",
                table: "TbItems");

            migrationBuilder.DropColumn(
                name: "NameAr",
                table: "TbCategories");

            migrationBuilder.DropColumn(
                name: "NameAr",
                table: "TbCartItem");

            migrationBuilder.RenameColumn(
                name: "NameEn",
                table: "TbStyles",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "TitleEn",
                table: "TbSliders",
                newName: "Title");

            migrationBuilder.RenameColumn(
                name: "nameEn",
                table: "TbOrderItems",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "NameEn",
                table: "TbItems",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "MaterialEn",
                table: "TbItems",
                newName: "Material");

            migrationBuilder.RenameColumn(
                name: "MaterialAr",
                table: "TbItems",
                newName: "Colors");

            migrationBuilder.RenameColumn(
                name: "DescriptionEn",
                table: "TbItems",
                newName: "Description");

            migrationBuilder.RenameColumn(
                name: "NameEn",
                table: "TbCategories",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "NameEn",
                table: "TbCartItem",
                newName: "Name");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Name",
                table: "TbStyles",
                newName: "NameEn");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "TbSliders",
                newName: "TitleEn");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "TbOrderItems",
                newName: "nameEn");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "TbItems",
                newName: "NameEn");

            migrationBuilder.RenameColumn(
                name: "Material",
                table: "TbItems",
                newName: "MaterialEn");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "TbItems",
                newName: "DescriptionEn");

            migrationBuilder.RenameColumn(
                name: "Colors",
                table: "TbItems",
                newName: "MaterialAr");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "TbCategories",
                newName: "NameEn");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "TbCartItem",
                newName: "NameEn");

            migrationBuilder.AddColumn<string>(
                name: "NameAr",
                table: "TbStyles",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TitleAr",
                table: "TbSliders",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "nameAr",
                table: "TbOrderItems",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

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
                name: "DescriptionAr",
                table: "TbItems",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "NameAr",
                table: "TbItems",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "NameAr",
                table: "TbCategories",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "NameAr",
                table: "TbCartItem",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
