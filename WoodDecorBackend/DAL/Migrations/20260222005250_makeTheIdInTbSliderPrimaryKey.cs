using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DAL.Migrations
{
    /// <inheritdoc />
    public partial class makeTheIdInTbSliderPrimaryKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameTable(
                name: "TbSlider",
                newName: "TbSliders");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TbSliders",
                table: "TbSliders",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_TbSliders",
                table: "TbSliders");

            migrationBuilder.RenameTable(
                name: "TbSliders",
                newName: "TbSlider");
        }
    }
}
