using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DAL.Migrations
{
    /// <inheritdoc />
    public partial class addTbCollectionsAndTheCollectionTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
          /*  migrationBuilder.DropTable(
                name: "TbFabrics");*/

            migrationBuilder.RenameColumn(
                name: "Image",
                table: "TbOrderItems",
                newName: "MainImage");

            migrationBuilder.AddColumn<Guid>(
                name: "TbCollectionsId",
                table: "TbOrderItems",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "TbCollectionsId",
                table: "TbImages",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "TbCollections",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MainImage = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FabricId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OldPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    StyleId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Dimensions = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SKU = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DiscountAmount = table.Column<int>(type: "int", nullable: true),
                    CategoryId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    OverallRating = table.Column<int>(type: "int", nullable: true),
                    StockNumber = table.Column<int>(type: "int", nullable: false),
                    Colors = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Material = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CurrentState = table.Column<int>(type: "int", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TbCollections", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TbCollections_TbCategories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "TbCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TbItemFabrics",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UpdatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CurrentState = table.Column<int>(type: "int", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TbItemFabrics", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TbItemFabrics_TbItems_ProductId",
                        column: x => x.ProductId,
                        principalTable: "TbItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TbCartCollection",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CartId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CollectionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    Total = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Image = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Color = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Fabric = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UpdatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CurrentState = table.Column<int>(type: "int", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TbCartCollection", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TbCartCollection_TbCart_CartId",
                        column: x => x.CartId,
                        principalTable: "TbCart",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TbCartCollection_TbCollections_CollectionId",
                        column: x => x.CollectionId,
                        principalTable: "TbCollections",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TbCollectionFabrics",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CollectionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UpdatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CurrentState = table.Column<int>(type: "int", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TbCollectionFabrics", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TbCollectionFabrics_TbCollections_CollectionId",
                        column: x => x.CollectionId,
                        principalTable: "TbCollections",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TbCollectionImages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CollectionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UpdatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CurrentState = table.Column<int>(type: "int", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TbCollectionImages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TbCollectionImages_TbCollections_CollectionId",
                        column: x => x.CollectionId,
                        principalTable: "TbCollections",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TbOrderCollection",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CollectionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MainImage = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OrderId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Qty = table.Column<int>(type: "int", nullable: false),
                    UnitPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CollectionsId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UpdatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CurrentState = table.Column<int>(type: "int", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TbOrderCollection", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TbOrderCollection_TbCollections_CollectionsId",
                        column: x => x.CollectionsId,
                        principalTable: "TbCollections",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TbOrderCollection_TbOrder_OrderId",
                        column: x => x.OrderId,
                        principalTable: "TbOrder",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TbOrderItems_TbCollectionsId",
                table: "TbOrderItems",
                column: "TbCollectionsId");

            migrationBuilder.CreateIndex(
                name: "IX_TbImages_TbCollectionsId",
                table: "TbImages",
                column: "TbCollectionsId");

            migrationBuilder.CreateIndex(
                name: "IX_TbCartCollection_CartId",
                table: "TbCartCollection",
                column: "CartId");

            migrationBuilder.CreateIndex(
                name: "IX_TbCartCollection_CollectionId",
                table: "TbCartCollection",
                column: "CollectionId");

            migrationBuilder.CreateIndex(
                name: "IX_TbCollectionFabrics_CollectionId",
                table: "TbCollectionFabrics",
                column: "CollectionId");

            migrationBuilder.CreateIndex(
                name: "IX_TbCollectionImages_CollectionId",
                table: "TbCollectionImages",
                column: "CollectionId");

            migrationBuilder.CreateIndex(
                name: "IX_TbCollections_CategoryId",
                table: "TbCollections",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_TbItemFabrics_ProductId",
                table: "TbItemFabrics",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_TbOrderCollection_CollectionsId",
                table: "TbOrderCollection",
                column: "CollectionsId");

            migrationBuilder.CreateIndex(
                name: "IX_TbOrderCollection_OrderId",
                table: "TbOrderCollection",
                column: "OrderId");

            migrationBuilder.AddForeignKey(
                name: "FK_TbImages_TbCollections_TbCollectionsId",
                table: "TbImages",
                column: "TbCollectionsId",
                principalTable: "TbCollections",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TbOrderItems_TbCollections_TbCollectionsId",
                table: "TbOrderItems",
                column: "TbCollectionsId",
                principalTable: "TbCollections",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TbImages_TbCollections_TbCollectionsId",
                table: "TbImages");

            migrationBuilder.DropForeignKey(
                name: "FK_TbOrderItems_TbCollections_TbCollectionsId",
                table: "TbOrderItems");

            migrationBuilder.DropTable(
                name: "TbCartCollection");

            migrationBuilder.DropTable(
                name: "TbCollectionFabrics");

            migrationBuilder.DropTable(
                name: "TbCollectionImages");

            migrationBuilder.DropTable(
                name: "TbItemFabrics");

            migrationBuilder.DropTable(
                name: "TbOrderCollection");

            migrationBuilder.DropTable(
                name: "TbCollections");

            migrationBuilder.DropIndex(
                name: "IX_TbOrderItems_TbCollectionsId",
                table: "TbOrderItems");

            migrationBuilder.DropIndex(
                name: "IX_TbImages_TbCollectionsId",
                table: "TbImages");

            migrationBuilder.DropColumn(
                name: "TbCollectionsId",
                table: "TbOrderItems");

            migrationBuilder.DropColumn(
                name: "TbCollectionsId",
                table: "TbImages");

            migrationBuilder.RenameColumn(
                name: "MainImage",
                table: "TbOrderItems",
                newName: "Image");

            migrationBuilder.CreateTable(
                name: "TbFabrics",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CurrentState = table.Column<int>(type: "int", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TbFabrics", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TbFabrics_TbItems_ProductId",
                        column: x => x.ProductId,
                        principalTable: "TbItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TbFabrics_ProductId",
                table: "TbFabrics",
                column: "ProductId");
        }
    }
}
