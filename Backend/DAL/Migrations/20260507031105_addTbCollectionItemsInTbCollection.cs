using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DAL.Migrations
{
    /// <inheritdoc />
    public partial class addTbCollectionItemsInTbCollection : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TbCollectionItems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ItemId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CollectionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UpdatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CurrentState = table.Column<int>(type: "int", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TbCollectionItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TbCollectionItems_TbCollections_CollectionId",
                        column: x => x.CollectionId,
                        principalTable: "TbCollections",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TbCollectionItems_TbItems_ItemId",
                        column: x => x.ItemId,
                        principalTable: "TbItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TbCollectionItems_CollectionId",
                table: "TbCollectionItems",
                column: "CollectionId");

            migrationBuilder.CreateIndex(
                name: "IX_TbCollectionItems_ItemId",
                table: "TbCollectionItems",
                column: "ItemId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TbCollectionItems");
        }
    }
}
