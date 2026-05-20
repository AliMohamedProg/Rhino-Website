using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DAL.Migrations
{
    /// <inheritdoc />
    public partial class FixTbChangesForeignKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TbChanges_TbCollections_TbCollectionsId",
                table: "TbChanges");

            migrationBuilder.DropIndex(
                name: "IX_TbChanges_TbCollectionsId",
                table: "TbChanges");

            migrationBuilder.DropColumn(
                name: "TbCollectionsId",
                table: "TbChanges");

            migrationBuilder.CreateIndex(
                name: "IX_TbChanges_CollectionId",
                table: "TbChanges",
                column: "CollectionId");

            migrationBuilder.AddForeignKey(
                name: "FK_TbChanges_TbCollections_CollectionId",
                table: "TbChanges",
                column: "CollectionId",
                principalTable: "TbCollections",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TbChanges_TbCollections_CollectionId",
                table: "TbChanges");

            migrationBuilder.DropIndex(
                name: "IX_TbChanges_CollectionId",
                table: "TbChanges");

            migrationBuilder.AddColumn<Guid>(
                name: "TbCollectionsId",
                table: "TbChanges",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_TbChanges_TbCollectionsId",
                table: "TbChanges",
                column: "TbCollectionsId");

            migrationBuilder.AddForeignKey(
                name: "FK_TbChanges_TbCollections_TbCollectionsId",
                table: "TbChanges",
                column: "TbCollectionsId",
                principalTable: "TbCollections",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
