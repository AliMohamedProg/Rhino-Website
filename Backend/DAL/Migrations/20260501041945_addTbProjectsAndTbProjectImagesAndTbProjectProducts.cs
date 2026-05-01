using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DAL.Migrations
{
    /// <inheritdoc />
    public partial class addTbProjectsAndTbProjectImagesAndTbProjectProducts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TbProjects",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AllianceId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UpdatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CurrentState = table.Column<int>(type: "int", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TbProjects", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TbProjects_TbBrands",
                        column: x => x.AllianceId,
                        principalTable: "TbAlliances",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "TbProjectImages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ProjectId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UpdatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CurrentState = table.Column<int>(type: "int", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TbProjectImages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TbProjectImages_TbProjects",
                        column: x => x.ProjectId,
                        principalTable: "TbProjects",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "TbProjectProducts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ItemId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProjectId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UpdatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CurrentState = table.Column<int>(type: "int", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TbProjectProducts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TbProjectProducts_TbItems",
                        column: x => x.ItemId,
                        principalTable: "TbItems",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_TbProjectProducts_TbProjects",
                        column: x => x.ProjectId,
                        principalTable: "TbProjects",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_TbProjectImages_ProjectId",
                table: "TbProjectImages",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_TbProjectProducts_ItemId",
                table: "TbProjectProducts",
                column: "ItemId");

            migrationBuilder.CreateIndex(
                name: "IX_TbProjectProducts_ProjectId",
                table: "TbProjectProducts",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_TbProjects_AllianceId",
                table: "TbProjects",
                column: "AllianceId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TbProjectImages");

            migrationBuilder.DropTable(
                name: "TbProjectProducts");

            migrationBuilder.DropTable(
                name: "TbProjects");
        }
    }
}
