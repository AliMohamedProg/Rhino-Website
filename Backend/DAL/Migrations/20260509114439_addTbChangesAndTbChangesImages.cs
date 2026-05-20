using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DAL.Migrations
{
    /// <inheritdoc />
    public partial class addTbChangesAndTbChangesImages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TbChanges",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    NewDimensions = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NewSKU = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OverPrice = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NewName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NewDescription = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CollectionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TbCollectionsId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UpdatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CurrentState = table.Column<int>(type: "int", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TbChanges", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TbChanges_TbCollections_TbCollectionsId",
                        column: x => x.TbCollectionsId,
                        principalTable: "TbCollections",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TbChangeImages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ChangeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TbChangesId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UpdatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CurrentState = table.Column<int>(type: "int", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TbChangeImages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TbChangeImages_TbChanges_TbChangesId",
                        column: x => x.TbChangesId,
                        principalTable: "TbChanges",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TbChangeImages_TbChangesId",
                table: "TbChangeImages",
                column: "TbChangesId");

            migrationBuilder.CreateIndex(
                name: "IX_TbChanges_TbCollectionsId",
                table: "TbChanges",
                column: "TbCollectionsId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TbChangeImages");

            migrationBuilder.DropTable(
                name: "TbChanges");
        }
    }
}
