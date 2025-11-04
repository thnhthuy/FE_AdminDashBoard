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
    required,
  } = styles;

  const { toast } = useContext(ToastContext);

  const initialFormData = {
    id: "",
    name: "",
    category: "Select category",
    price: "",
    inventory: "",
    colors: "",
    sizes: "",
    img: null,
  };

  const [submitted, setSubmitted] = useState(false);

  const getRequiredClass = (field) => {
    return submitted && !formData[field] ? styles.required : "";
  };

  const [formData, setFormData] = useState(initialFormData);

  // popup
  const popupCategories = ["Jeans", "Shirt", "Shoes"];
  const [isPopUp, setIsPopUp] = useState(false);
  const [popupMode, setPopupMode] = useState("add"); // "add" hoặc "edit"
  const [selectedProduct, setSelectedProduct] = useState(null); // sản phẩm đang chỉnh sửa

  const [products, setProducts] = useState(productData); // thay vì dùng dữ liệu tĩnh trực tiếp products

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // add product
  const handleAddProduct = (newProduct) => {
    setProducts((prev) => [...prev, newProduct]);
    toast.success("Product added successfully!");
    setIsPopUp(false);
  };
  // edit product
  const handleEditProduct = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    toast.success("Product updated successfully!");
    setIsPopUp(false);
  };

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
  // open popup
  // const handletoOpenPopup = () => {
  //   setPopupMode("add");
  //   setSelectedProduct(null);
  //   setFormData({
  //     id: `T${Math.floor(Math.random() * 1000)}`,
  //     name: "",
  //     category: "Select category",
  //     price: 0,
  //     inventory: 0,
  //     colors: "",
  //     sizes: "",
  //     img: null,
  //   });
  //   setImgPreview(null);
  //   setIsPopUp(true);
  // };

  // open add popup
  const handleOpenAddPopup = () => {
    setFormData({
      ...initialFormData,
      id: products.length + 1,
    });
    setSubmitted(false);
    setIsPopUp(true);
  };

  // open edit popup
  const handletoEditPopup = (product) => {
    setPopupMode("edit");
    setSelectedProduct(product);
    setFormData({
      id: product.id,
      name: product.name,
      category: product.category,
      price: parseFloat(product.priceOriginal.replace(/[^0-9.]/g, "")) || "",
      inventory: product.inventory,
      colors: product.colors.join(", "),
      sizes: product.sizes.join(", "),
      img: product.img,
    });
    setImgPreview(product.img || null);
    setIsPopUp(true);
  };
  // close popup

  const handletoClosePopup = () => {
    setFormData(initialFormData);
    setErrors({});
    setSubmitted(false);
    setIsPopUp(false);
    setImgPreview(null);
  };

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    let firstToastShown = false;

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required!";
      if (!firstToastShown) {
        toast.error(newErrors.name);
        firstToastShown = true;
      }
    }

    if (formData.category === "Select category") {
      newErrors.category = "Please select a category!";
      if (!firstToastShown) {
        toast.error(newErrors.category);
        firstToastShown = true;
      }
    }

    if (!formData.colors.trim()) {
      newErrors.colors = "Please enter at least one color!";
      if (!firstToastShown) {
        toast.error(newErrors.colors);
        firstToastShown = true;
      }
    }

    if (!formData.sizes.trim()) {
      newErrors.sizes = "Please enter at least one size!";
      if (!firstToastShown) {
        toast.error(newErrors.sizes);
        firstToastShown = true;
      }
    }

    if (formData.price <= 0) {
      newErrors.price = "Price must be greater than 0!";
      if (!firstToastShown) {
        toast.error(newErrors.price);
        firstToastShown = true;
      }
    }

    if (formData.inventory < 0) {
      newErrors.inventory = "Inventory cannot be negative!";
      if (!firstToastShown) {
        toast.error(newErrors.inventory);
        firstToastShown = true;
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstErrorKey = Object.keys(newErrors)[0];
      const inputEl = document.querySelector(`input[name="${firstErrorKey}"]`);
      if (inputEl) inputEl.focus();
      return false;
    }

    return true;
  };

  const popUpCategoryRef = useRef(null);
  useClickOutside(popUpCategoryRef, () => setPopUpDropdownOpen(false));
  // const [popUpCategory, setPopUpCategory] = useState("Select category");
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
      const url = URL.createObjectURL(file);
      setImgPreview(url);
      setFormData({ ...formData, img: url });
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
          onClick={handleOpenAddPopup}
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
                        {Array.isArray(product.colors) &&
                        product.colors.length > 0 ? (
                          product.colors.map((c, idx) => (
                            <button key={idx} style={{ marginRight: 6 }}>
                              {c}
                            </button>
                          ))
                        ) : (
                          <span>-</span>
                        )}
                      </td>
                      <td>
                        {Array.isArray(product.sizes) &&
                        product.sizes.length > 0 ? (
                          product.sizes.map((s, idx) => (
                            <button key={idx} style={{ marginRight: 6 }}>
                              {s}
                            </button>
                          ))
                        ) : (
                          <span>-</span>
                        )}
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
              setSubmitted(true);
              if (!validateForm()) return;

              const newProduct = {
                id: popupMode === "add" ? products.length + 1 : formData.id,
                name: formData.name,
                priceOriginal: `$${Number(formData.price).toFixed(2)}`,
                inventory: Number(formData.inventory),
                colors: formData.colors
                  .split(",")
                  .map((c) => c.trim().toLowerCase()),
                sizes: formData.sizes
                  .split(",")
                  .map((s) => s.trim().toUpperCase()),
                img: formData.img || imgPreview || selectedProduct?.img || "",
                category: formData.category,
                status:
                  formData.inventory === 0
                    ? "Out of stock"
                    : formData.inventory <= 50
                    ? "Low stock"
                    : "In stock",
              };

              if (popupMode === "add") {
                handleAddProduct(newProduct);
              } else {
                handleEditProduct(newProduct);
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
                    value={formData.id}
                    disabled={popupMode === "edit"}
                  />
                </div>
                <div className={spaceY2}>
                  <div>
                    <label>
                      Product Name{" "}
                      <span className={getRequiredClass("name")}>*</span>
                    </label>
                  </div>
                  <Input
                    placeholder="Enter product name..."
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className={gridCols2}>
                <div className={spaceY2}>
                  <div>
                    <label>
                      Category{" "}
                      <span className={getRequiredClass("category")}>*</span>
                    </label>
                  </div>
                  <div
                    className={dropdown}
                    onClick={() => setPopUpDropdownOpen(!popUpDropdownOpen)}
                  >
                    <Button
                      styles={{ width: "100%" }}
                      content={formData.category}
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
                              setFormData({ ...formData, category: option }),
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
                  <div>
                    <label>
                      Price <span className={getRequiredClass("price")}>*</span>
                    </label>
                  </div>
                  <Input
                    placeholder="0"
                    type="number"
                    name="price"
                    min="0"
                    value={formData.price}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className={spaceY2}>
                <div>
                  <label>
                    Inventory{" "}
                    <span className={getRequiredClass("inventory")}>*</span>
                  </label>
                </div>
                <Input
                  placeholder="0"
                  type="number"
                  name="inventory"
                  min="0"
                  value={formData.inventory}
                  onChange={handleInputChange}
                />
              </div>
              <div className={spaceY2}>
                <div>
                  <label>
                    Colors <span className={getRequiredClass("colors")}>*</span>
                  </label>
                </div>
                <Input
                  placeholder="EX: Red, Blue, Green (separated by commas)"
                  type="text"
                  name="colors"
                  value={formData.colors}
                  onChange={handleInputChange}
                />
              </div>
              <div className={spaceY2}>
                <div>
                  <label>
                    Sizes <span className={getRequiredClass("sizes")}>*</span>
                  </label>
                </div>
                <Input
                  placeholder="EX: S, M, L (separated by commas)"
                  type="text"
                  name="sizes"
                  value={formData.sizes}
                  onChange={handleInputChange}
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
