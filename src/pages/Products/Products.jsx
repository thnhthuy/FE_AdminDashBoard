import HeaderCommon from "@layout/HeaderCommon/HeaderCommon";
import Card from "@components/Card/Card";
import CardHeader from "@components/Card/CardHeader/CardHeader";
import CardContent from "@components/Card/CardContent/CardContent";
import styles from "./styles.module.scss";
import { productData, tableHeaders } from "./constants";
import { useContext, useEffect, useRef, useState } from "react";
import Button from "@components/ui/Button/Button";
import Input from "@components/ui/Input/Input";
import ActionMenu from "@components/ui/ActionMenu/ActionMenu";
import { RiArrowDropDownLine } from "react-icons/ri";
import { TfiClose, TfiPackage } from "react-icons/tfi";
import classNames from "classnames";
import PopUp from "@ui/PopUp/PopUp";
import useClickOutside from "@hooks/useClickOutside";
import { GrFormUpload } from "react-icons/gr";
import Information from "@components/ui/Information/Information";
import { CiSearch, CiWarning } from "react-icons/ci";
import { ToastContext } from "@contexts/ToastContext";
import Pagination from "../../components/ui/Pagination/Pagination";
function Products() {
  const {
    container,
    header,
    title,
    containerCard,
    headerCard,
    table,
    popUpcontent,
    gridCols2,
    spaceY2,
    containerlstBtn,
    lstBtn,
    findContainer,
    selectWrapper,
    selectCustom,
    options,
    dropdown,
    preview,
    stylesBtnUpload,
    uploadBtn,
    containerInformation,
    imgProduct,
  } = styles;

  const { toast } = useContext(ToastContext);

  // popup
  const popupCategories = ["Jeans", "Shirt", "Shoes"];
  const [isPopUp, setIsPopUp] = useState(false);
  const [popupMode, setPopupMode] = useState("add"); // "add" hoặc "edit"
  const [selectedProduct, setSelectedProduct] = useState(null); // sản phẩm đang chỉnh sửa

  const [products, setProducts] = useState(productData); // thay vì dùng dữ liệu tĩnh trực tiếp products
  // delete product
  const handleDeleteProduct = (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmed) return;

    const updatedProducts = products.filter(
      (product) => product.id !== productId
    );
    setProducts(updatedProducts);
    toast.success(`Product ${productId} deleted successfully!`);
  };
  const handletoOpenPopup = () => {
    setPopupMode("add");
    setSelectedProduct(null);
    setIsPopUp(true);
  };
  const handletoEditPopup = (product) => {
    setPopupMode("edit");
    setSelectedProduct(product);
    setPopUpCategory(product.category);
    setImgPreview(product.img || null);
    setIsPopUp(true);
  };

  const handletoClosePopup = () => {
    setIsPopUp(false);
    setPopUpCategory("Select category");
    setImgPreview(null);
  };
  const popUpCategoryRef = useRef(null);
  useClickOutside(popUpCategoryRef, () => setPopUpDropdownOpen(false));
  const [popUpCategory, setPopUpCategory] = useState("Select category");
  const [popUpDropdownOpen, setPopUpDropdownOpen] = useState(false);

  // action menu
  const [isOpenId, setIsOpenId] = useState(null);

  //  category
  const [open, setOpen] = useState(false);
  const optionsCategory = ["All", "Jeans", "Shirt", "Shoes"];

  const [filterCategory, setFilterCategory] = useState("All");

  // status
  const dataStatus = [
    { status: "All" },
    { status: "In stock" },
    { status: "Low stock" },
    { status: "Out of stock" },
  ];
  const [filterStatus, setFilterStatus] = useState("All");

  // Thống kê sản phẩm
  const totalProducts = products.length;

  // Đếm số lượng theo tồn kho
  const inStock = products.filter((p) => p.inventory > 50).length;
  const lowStock = products.filter(
    (p) => p.inventory > 0 && p.inventory <= 50
  ).length;
  const outOfStock = products.filter((p) => p.inventory === 0).length;

  //information
  const informations = [
    {
      title: "Total products",
      icon: <TfiPackage />,
      value: totalProducts,
    },
    {
      title: "In stock",
      icon: <TfiPackage />,
      value: inStock,
    },
    {
      title: "Low stock",
      icon: <CiWarning />,
      value: lowStock,
    },
    {
      title: "Out of stock",
      icon: <CiWarning />,
      value: outOfStock,
    },
  ];

  useEffect(() => {
    setCurrentPage(1);
  }, [filterCategory, filterStatus]);
  // upload image preview
  const [imgPreview, setImgPreview] = useState(null);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (imgPreview) URL.revokeObjectURL(imgPreview); //giải phóng URL cũ
      setImgPreview(URL.createObjectURL(file));
    }
  };

  const fileInputRef = useRef(null);
  const handleButtonClick = () => fileInputRef.current.click();

  // lọc dữ liệu sản phẩm theo danh mục
  // const filteredProducts =
  //   filterCategory === "All"
  //     ? products
  //     : products.filter(
  //         (product) =>
  //           product.category.toLowerCase() === filterCategory.toLowerCase()
  //       );

  // lọc dữ liệu sản phẩm theo trạng thái
  // const filteredProductsByStatus =
  //   filterStatus === "All"
  //     ? products
  //     : products.filter(
  //         (product) =>
  //           product.status.toLowerCase() === filterStatus.toLowerCase()
  //       );

  // lọc danh mục(category) và trạng thái(status)
  const filteredProducts = products.filter((product) => {
    const category =
      filterCategory === "All" ||
      product.category.toLowerCase() === filterCategory.toLowerCase();

    const status =
      filterStatus === "All" ||
      product.status.toLowerCase() === filterStatus.toLowerCase();

    return category && status;
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentProducts = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className={container}>
      {/* <HeaderCommon showAddButton={true} onClick={handletoOpenPopup} /> */}
      <div className={header}>
        <div className={title}>
          <h2>Product Management</h2>
          <p>Manage product listings, categories, and inventory.</p>
        </div>
        <Button
          showIcon={true}
          content="Add Product"
          onClick={handletoOpenPopup}
        />
      </div>

      <div className={containerInformation}>
        {informations.map((info) => (
          <Information
            title={info.title}
            icon={info.icon}
            content={info.value}
          />
        ))}
      </div>
      <div className={containerlstBtn}>
        <div className={lstBtn}>
          {dataStatus.map((btn) => (
            <Button
              content={btn.status}
              isPrimary={false}
              btnActive={filterStatus === btn.status}
              onClick={() => setFilterStatus(btn.status)}
            />
          ))}
        </div>
      </div>

      <Card>
        <div className={containerCard}>
          <CardHeader className={headerCard}>
            <h4>Product List</h4>
            <p>Manage all products in the warehouse.</p>
          </CardHeader>
          <div className={findContainer}>
            <Input placeholder="Search..." showIcon={true} />

            {/* dropdown filter category */}
            <div className={dropdown} onClick={() => setOpen(!open)}>
              <Button content={filterCategory} isPrimary={false} />
              <span>
                <RiArrowDropDownLine />
              </span>

              {open && (
                <div className={options}>
                  {optionsCategory.map((option) => (
                    <div
                      onClick={() => (
                        setFilterCategory(option), setOpen(false)
                      )}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <CardContent>
            <table className={table}>
              <thead>
                <tr>
                  {tableHeaders.map((item) => {
                    return <th key={item}>{item.toUpperCase()}</th>;
                  })}
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((product) => {
                  return (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-start",
                          gap: "8px",
                        }}
                      >
                        <img src={product.img} />
                        <span>{product.name}</span>
                      </td>
                      <td>{product.category}</td>
                      <td>
                        <button>{product.colors[2]}</button>
                      </td>
                      <td>
                        <button>{product.sizes[0]}</button>
                      </td>
                      <td>{product.priceOriginal}</td>
                      <td>{product.inventory}</td>
                      <td>{product.status}</td>
                      <td>
                        <ActionMenu
                          isOpen={isOpenId === product.id}
                          onToggle={() =>
                            setIsOpenId(
                              isOpenId === product.id ? null : product.id
                            )
                          }
                          onClose={() => setIsOpenId(null)}
                          onEdit={() => handletoEditPopup(product)}
                          onDelete={() => {
                            handleDeleteProduct(product.id);
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </CardContent>

          {/* PopUp */}
          <PopUp
            isOpen={isPopUp}
            onClose={() => {
              handletoClosePopup();
            }}
            title={popupMode === "add" ? "Add new product" : "Edit product"}
            des={
              popupMode === "add"
                ? "Enter the product information to be added to the inventory."
                : "Update product information below."
            }
            confirmText={popupMode === "add" ? "Add Product" : "Save Changes"}
            onConfirm={() => {
              if (popupMode === "add") {
                toast.success("Product added successfully!");
              } else {
                toast.info("Product updated successfully!");
              }
              setIsPopUp(false);
            }}
          >
            <div className={popUpcontent}>
              <div className={gridCols2}>
                <div className={spaceY2}>
                  <label>ID</label>
                  <Input
                    type="text"
                    placeholder="EX: T001"
                    defaultValue={selectedProduct?.id || ""}
                    disabled={popupMode === "edit"}
                  />
                </div>
                <div className={spaceY2}>
                  <label>Product Name</label>
                  <Input
                    placeholder="Enter product name..."
                    type="text"
                    defaultValue={selectedProduct?.name || ""}
                  />
                </div>
              </div>

              <div className={gridCols2}>
                <div className={spaceY2}>
                  <label>Category</label>
                  <div
                    className={dropdown}
                    onClick={() => setPopUpDropdownOpen(!popUpDropdownOpen)}
                  >
                    <Button
                      styles={{ width: "100%" }}
                      content={popUpCategory}
                      isPrimary={false}
                    />
                    <span>
                      <RiArrowDropDownLine />
                    </span>

                    {popUpDropdownOpen && (
                      <div className={options}>
                        {popupCategories.map((option) => (
                          <div
                            key={option}
                            onClick={() => (
                              setPopUpCategory(option),
                              setPopUpDropdownOpen(false)
                            )}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className={spaceY2}>
                  <label>Price</label>
                  <Input
                    placeholder="0"
                    type="text"
                    defaultValue={selectedProduct?.priceOriginal || ""}
                  />
                </div>
              </div>

              <div className={spaceY2}>
                <label>Inventory</label>
                <Input
                  placeholder="0"
                  type="text"
                  defaultValue={selectedProduct?.inventory || ""}
                />
              </div>
              <div className={spaceY2}>
                <label>Colors</label>
                <Input
                  placeholder="EX: Red, Blue, Green (separated by commas)"
                  type="text"
                  defaultValue={selectedProduct?.colors?.join(", ") || ""}
                />
              </div>
              <div className={spaceY2}>
                <label>Sizes</label>
                <Input
                  placeholder="EX: S, M, L (separated by commas)"
                  type="text"
                  defaultValue={selectedProduct?.sizes?.join(", ") || ""}
                />
              </div>

              <div className={spaceY2}>
                <label>Image</label>
                <div className={uploadBtn}>
                  <input
                    type="file"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                  />
                  <div className={stylesBtnUpload} onClick={handleButtonClick}>
                    <span>
                      <GrFormUpload />
                    </span>
                    <Button content={"Upload Image"} />
                  </div>
                </div>
              </div>
            </div>

            {imgPreview && (
              <div className={preview}>
                <img src={imgPreview} alt="Preview" />
              </div>
            )}
          </PopUp>
        </div>
      </Card>
    </div>
  );
}

export default Products;
