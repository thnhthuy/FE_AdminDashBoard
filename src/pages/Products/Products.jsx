import Card from "@components/Card/Card";
import CardHeader from "@components/Card/CardHeader/CardHeader";
import CardContent from "@components/Card/CardContent/CardContent";
import styles from "./styles.module.scss";
import { productData, tableHeaders, categoriesData } from "./constants";
import { use, useContext, useEffect, useRef, useState } from "react";
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
import Pagination from "@components/ui/Pagination/Pagination";
import { GiCheckMark } from "react-icons/gi";
import { HiMiniPlus } from "react-icons/hi2";
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
    optionCategory,
    arrowIcon,
    dropdownCategory,
    popUpContent,
    section,
    attributeBlock,
    attributeHeader,
    attributeNameWrapper,
    variantTable,
    variantTableHeader,
    variantTableRow,
    attributeValueList,
    attributeValueItem,
    statusGreen,
    statusYellow,
    statusRed,
    description,
    categoryPicker,
  } = styles;

  const { toast } = useContext(ToastContext);
  const nameRef = useRef(null);
  const priceRef = useRef(null);
  const colorRefs = useRef([]);
  const sizeRef = useRef([]);

  const initialFormData = {
    name: "",
    description: "",
    categoryId: "",
    listPrice: "",
    salePrice: "",
    video: "",
    coverImage: "",
    imageProduct: [],
    attributes: [],
    productVariant: [],
  };
  const [isPopUp, setIsPopUp] = useState(false);

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (isPopUp) {
      generateVariants();
    }
  }, [formData.attributes, isPopUp]);
  // tính tổng tồn kho
  const getTotalInventory = (product) => {
    if (!Array.isArray(product.productVariant)) return 0;
    return product.productVariant.reduce(
      (sum, v) => sum + (Number(v.inventory) || 0),
      0
    );
  };
  // lấy trạng thái
  const getStatus = (product) => {
    if (
      !Array.isArray(product.productVariant) ||
      product.productVariant.length === 0
    )
      return "-";
    const total = getTotalInventory(product);
    if (total > 10) return "In stock";
    if (total > 0) return "Low stock";
    return "Out of stock";
  };
  const getStatusColor = (product) => {
    const total = getTotalInventory(product);
    if (total > 10) return statusGreen;
    if (total > 0) return statusYellow;
    return statusRed;
  };

  const [submitted, setSubmitted] = useState(false);

  const getRequiredClass = (field) => {
    return submitted && !formData[field] ? styles.required : "";
  };

  // popup
  // const popupCategories = ["Jeans", "Shirt", "Shoes"];

  const [categories, setCategories] = useState(categoriesData);
  const [loadingCategories, setLoadingCategories] = useState(true);
  // category picker
  const [isCategoryPickerOpen, setIsCategoryPickerOpen] = useState(false);

  // --- Category Select Logic ---
  const handleCategorySelect = (category) => {
    setFormData((prev) => ({
      ...prev,
      categoryId: category.id,
      categoryName: category.name,
    }));
  };

  const CategoryItem = ({ category, level = 0, selectedId, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasChildren =
      category.childCategory && category.childCategory.length > 0;
    const isSelected = category.id === selectedId;

    const handleClick = (e) => {
      e.stopPropagation();

      if (hasChildren) {
        setIsOpen(!isOpen);
      } else {
        onSelect(category);
      }
    };

    return (
      <div>
        <div
          onClick={handleClick}
          style={{
            marginLeft: level * 15,
            padding: "6px 8px",
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px dotted #eee",
            backgroundColor: isSelected ? "#e0f7fa" : "white",
            color: isSelected ? "#007bff" : "black",
            fontWeight: hasChildren ? "bold" : "normal",
            transition: "background-color 0.1s",
          }}
        >
          <span style={{ display: "flex", alignItems: "center" }}>
            {/* {hasChildren && (
              <span
                style={{
                  marginRight: 5,
                  transition: "transform 0.1s",
                  transform: isOpen ? "rotate(90deg)" : "none",
                }}
              >
                ▶
              </span>
            )} */}
            {category.name}
          </span>
          {isSelected && (
            <span>
              {" "}
              <GiCheckMark />
            </span>
          )}
        </div>

        {hasChildren && isOpen && (
          <div style={{ paddingLeft: 5 }}>
            {category.childCategory.map((child) => (
              <CategoryItem
                key={child.id}
                category={child}
                level={level + 1}
                selectedId={selectedId}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const CategoryList = ({ categories, selectedCategoryId, onSelect }) => {
    return (
      <div>
        {categories.map((cat) => (
          <CategoryItem
            key={cat.id}
            category={cat}
            selectedId={selectedCategoryId}
            onSelect={onSelect}
            level={0}
          />
        ))}
      </div>
    );
  };

  const getSelectedCategoryName = () => {
    if (!formData.categoryId) return "Select Category...";
    const selectedCat = flatCategoryList.find(
      (cat) => cat.id === formData.categoryId
    );
    return selectedCat
      ? selectedCat.name.replace(/— /g, "").trim()
      : "Select Category...";
  };
  const flattenCategories = (categories, prefix = "") => {
    let flatList = [];
    categories.forEach((cat) => {
      flatList.push({
        id: cat.id,
        name: prefix + cat.name,
      });
      if (cat.childCategory && cat.childCategory.length > 0) {
        flatList = flatList.concat(
          flattenCategories(cat.childCategory, prefix + "— ")
        );
      }
    });
    return flatList;
  };
  const flatCategoryList = flattenCategories(categoriesData);

  // test
  useEffect(() => {
    setCategories(categoriesData);
    setLoadingCategories(false);
  }, []);

  const [popupMode, setPopupMode] = useState("add"); // "add" hoặc "edit"
  const [selectedProduct, setSelectedProduct] = useState(null); // sản phẩm đang chỉnh sửa

  const [products, setProducts] = useState(productData); // thay vì dùng dữ liệu tĩnh trực tiếp products

  // console.log(productData);

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
    handletoClosePopup();
  };
  // edit product
  const handleEditProduct = (updatedProduct) => {
    updatedProduct.listPrice = Number(formData.listPrice);
    updatedProduct.salePrice = Number(formData.salePrice);

    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    toast.success("Product updated successfully!");
    handletoClosePopup();
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

  // open add popup
  const handleOpenAddPopup = () => {
    setPopupMode("add");
    setFormData({
      ...initialFormData,
      id: products.length + 1,
    });
    setImgCoverPreview(null);
    setImageProducts([]);
    setSubmitted(false);
    setIsPopUp(true);
  };

  // open edit popup
  const handletoEditPopup = (product) => {
    setPopupMode("edit");
    setSelectedProduct(product.categoryId);
    setFormData({
      ...product,
      salePrice: Number(product.salePrice) || 0,
      listPrice: Number(product.listPrice) || 0,
      coverImage: product.coverImage || product.img || "",
      attributes: product.attributes
        ? JSON.parse(JSON.stringify(product.attributes))
        : [],
      productVariant: product.productVariant
        ? JSON.parse(JSON.stringify(product.productVariant))
        : [],
    });

    setImgCoverPreview(product.img || null);
    setImageProducts(product.imageProduct || []);
    setIsPopUp(true);
  };

  // close popup

  const handletoClosePopup = () => {
    setFormData(initialFormData);
    setErrors({});
    setSubmitted(false);
    setImgCoverPreview(null);
    setImageProducts([]);
    setIsPopUp(false);
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
        nameRef.current?.focus();
      }
    }

    if (!formData.listPrice || Number(formData.listPrice) <= 0) {
      newErrors.listPrice = "Price must be greater than 0!";
      if (!firstToastShown) {
        toast.error(newErrors.listPrice);
        firstToastShown = true;
        priceRef.current?.focus();
      }
    }

    const colorAttr = formData.attributes.find((attr) =>
      attr.name.toLowerCase().includes("màu sắc")
    );
    const sizeAttr = formData.attributes.find((attr) =>
      attr.name.toLowerCase().includes("kích thước")
    );

    if (!colorAttr || colorAttr.attributeValue.length === 0) {
      newErrors.colors = "Please enter at least one color!";
      if (!firstToastShown) {
        toast.error(newErrors.colors);
        firstToastShown = true;
        colorRefs.current?.focus();
      }
    }

    if (!sizeAttr || sizeAttr.attributeValue.length === 0) {
      newErrors.sizes = "Please enter at least one size!";
      if (!firstToastShown) {
        toast.error(newErrors.sizes);
        firstToastShown = true;
        sizeRef.current?.focus();
      }
    }

    const hasEmptyAttributeName = formData.attributes.some(
      (attr) => !attr.name.trim()
    );
    if (hasEmptyAttributeName) {
      newErrors.attributeName = "Attribute name cannot be empty!";
      if (!firstToastShown) {
        toast.error(newErrors.attributeName);
        firstToastShown = true;
      }
    }

    // if (formData.productVariant.length === 0) {
    //   newErrors.productVariant = "Please generate product variants!";
    //   if (!firstToastShown) {
    //     toast.error(newErrors.productVariant);
    //     firstToastShown = true;
    //   }
    // } else {
    //   const invalidVariant = formData.productVariant.find(
    //     (v) => Number(v.inventory) <= 0 || Number(v.price) <= 0
    //   );
    //   if (invalidVariant) {
    //     newErrors.variant = "Each variant must have valid price and inventory!";
    //     if (!firstToastShown) {
    //       toast.error(newErrors.variant);
    //       firstToastShown = true;
    //     }
    //   }
    // }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const popUpCategoryRef = useRef(null);
  useClickOutside(popUpCategoryRef, () => setPopUpDropdownOpen(false));
  // const [popUpCategory, setPopUpCategory] = useState("Select category");
  const [popUpDropdownOpen, setPopUpDropdownOpen] = useState(false);

  // action menu
  const [isOpenId, setIsOpenId] = useState(null);

  //  category
  // const [open, setOpen] = useState(false);
  // const optionsCategory = ["All", "Jeans", "Shirt", "Shoes"];

  const [filterCategory, setFilterCategory] = useState(null);
  const [isFilterCategoryOpen, setIsFilterCategoryOpen] = useState(false);

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
  const inStock = getStatus
    ? products.filter((p) => getStatus(p) === "In stock").length
    : 0;
  const lowStock = getStatus
    ? products.filter((p) => getStatus(p) === "Low stock").length
    : 0;
  const outOfStock = getStatus
    ? products.filter((p) => getStatus(p) === "Out of stock").length
    : 0;
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

  // searchItem
  const [searchIterm, setSearchIterm] = useState("");

  // lọc sản phẩm

  const filteredProducts = products.filter((product) => {
    const searchForName = searchIterm.toLowerCase();
    const isSearchMatch = product.name.toLowerCase().includes(searchForName);
    if (!isSearchMatch) return false;
    const category = !filterCategory || product.categoryId === filterCategory;
    const status =
      filterStatus === "All" || getStatus(product) === filterStatus;

    return category && status;
  });
  const getFilterCategoryName = () => {
    if (!filterCategory || filterCategory === "All") {
      return "All";
    }
    const selectedCat = flatCategoryList.find(
      (cat) => cat.id === filterCategory
    );
    return selectedCat ? selectedCat.name.replace(/— /g, "").trim() : "All";
  };

  const handleFilterCategorySelect = (cat) => {
    setFilterCategory(cat.id);
    setIsFilterCategoryOpen(false);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filterCategory, filterStatus]);
  // upload image preview

  const [imgCoverPreview, setImgCoverPreview] = useState(null);
  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    setFormData((prev) => ({
      ...prev,
      coverImage: url, // URL tạm thời cho preview
    }));
  };

  // description ref
  const descriptionRef = useRef(null);

  const fileInputImgCoverRef = useRef(null);
  const handleButtonClick = () => fileInputImgCoverRef.current.click();

  // upload nhieu anh
  const [someImgPreview, setImageProducts] = useState([]);
  const fileInputSomeImgRef = useRef(null);

  const handleSomeImgButtonClick = () => fileInputSomeImgRef.current.click();

  const handleSomeImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const urls = files.map((file) => URL.createObjectURL(file));
      setImageProducts((prev) => [...prev, ...urls]);
      setFormData((prev) => ({
        ...prev,
        imageProduct: [...prev.imageProduct, ...urls],
      }));
    }
  };

  const promoteAttributeImageToCover = (imageUrl) => {
    setFormData((prev) => ({
      ...prev,
      coverImage: imageUrl,
    }));
    setImgCoverPreview(imageUrl);
    toast.success("Image successfully set as Product Cover.");
  };
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

  // test
  const [imageInput, setImageInput] = useState("");
  const addImage = () => {
    if (imageInput.trim()) {
      setFormData({
        ...formData,
        imageProduct: [...formData.imageProduct, imageInput],
      });
      setImageInput("");
    }
  };
  const removeImage = (i) => {
    const imgs = formData.imageProduct.filter((_, index) => index !== i);
    setFormData({ ...formData, imageProduct: imgs });
  };

  // --- ATTRIBUTE HANDLER ---
  const addAttribute = () => {
    setFormData((prev) => ({
      ...prev,
      attributes: [...prev.attributes, { name: "", attributeValue: [] }],
    }));
  };

  const updateAttribute = (index, key, value) => {
    setFormData((prev) => {
      const updatedAttributes = prev.attributes.map((attr, i) =>
        i === index ? { ...attr, [key]: value } : attr
      );

      return { ...prev, attributes: updatedAttributes };
    });
  };
  // Add attribute value
  const addAttributeValue = (index) => {
    setFormData((prev) => {
      const attributes = prev.attributes.map((attr, i) => {
        if (i !== index) return attr;
        return {
          ...attr,
          attributeValue: [
            ...(attr.attributeValue || []),
            { value: "", image: "" },
          ],
        };
      });

      return { ...prev, attributes };
    });
  };
  const updateAttributeValue = (attrIndex, valueIndex, key, value) => {
    const updated = formData.attributes.map((attr, i) =>
      i === attrIndex
        ? {
            ...attr,
            attributeValue: attr.attributeValue.map((val, j) =>
              j === valueIndex ? { ...val, [key]: value } : val
            ),
          }
        : attr
    );
    setFormData({ ...formData, attributes: updated });
  };

  // Remove attribute value
  const removeAttributeValue = (attrIndex, valueIndex) => {
    const updated = [...formData.attributes];
    updated[attrIndex].attributeValue.splice(valueIndex, 1);
    setFormData({ ...formData, attributes: updated });
  };

  // Remove attribute
  const removeAttribute = (attrIndex) => {
    if (
      !window.confirm(
        "Do you want to delete this attribute (including all its values)?"
      )
    ) {
      return;
    }
    const updated = formData.attributes.filter((_, i) => i !== attrIndex);
    setFormData({ ...formData, attributes: updated });
  };
  // kiểm tra điều kiện hiển thị image input
  // const shouldShowImageInput = (attributeName) => {
  //   if (!attributeName) return false;
  //   return (
  //     attributeName.toLowerCase().includes("color") ||
  //     attributeName.toLowerCase().includes("màu")
  //   );
  // };

  // const handleAttributeImageChange = (attrIndex, valueIndex, files) => {
  //   const fileArray = Array.from(files);
  //   if (fileArray.length === 0) return;

  //   setFormData((prev) => {
  //     const newUrls = fileArray.map((file) => URL.createObjectURL(file));

  //     const updatedAttributes = prev.attributes.map((attr, i) => {
  //       if (i === attrIndex) {
  //         const updatedValues = attr.attributeValue.map((val, j) => {
  //           if (j === valueIndex) {
  //             const currentImages = val.images || {
  //               coverImage: "",
  //               imageProduct: [],
  //             };

  //             return {
  //               ...val,
  //               images: {
  //                 ...currentImages,
  //                 imageProduct: [...currentImages.imageProduct, ...newUrls],
  //               },
  //             };
  //           }
  //           return val;
  //         });
  //         return { ...attr, attributeValue: updatedValues };
  //       }
  //       return attr;
  //     });

  //     return { ...prev, attributes: updatedAttributes };
  //   });
  // };

  const handleAttributeImageChange = (attrIndex, valueIndex, file) => {
    // if (!file) return;
    if (!file || !(file instanceof File)) {
      console.error("Invalid file input");
      return;
    }

    const url = URL.createObjectURL(file);

    setFormData((prev) => {
      const updatedAttributes = prev.attributes.map((attr, i) => {
        if (i === attrIndex) {
          const updatedValues = attr.attributeValue.map((val, j) => {
            if (j === valueIndex) {
              return {
                ...val,
                image: url,
                // fileObject: file, // Đối tượng File gốc
              };
            }
            return val;
          });
          return { ...attr, attributeValue: updatedValues };
        }
        return attr;
      });

      return { ...prev, attributes: updatedAttributes };
    });
  };

  // --- VARIANT HANDLER ---
  // const addVariant = () => {
  //   setFormData({
  //     ...formData,
  //     productVariant: [
  //       ...formData.productVariant,
  //       {
  //         price: "",
  //         length: "",
  //         width: "",
  //         height: "",
  //         weight: "",
  //         variantAttributes: [],
  //       },
  //     ],
  //   });
  // };

  const generateVariants = () => {
    const attributes = formData.attributes;

    // 1. Kiểm tra nếu không có thuộc tính nào được nhập
    // if (
    //   attributes.length === 0 ||
    //   attributes.every((attr) => attr.attributeValue.length === 0)
    // ) {
    //   setFormData({ ...formData, productVariant: [] });
    //   toast.error("Please add attributes with values to generate variants!");
    //   return;
    // }

    // 2. Chuẩn bị dữ liệu cho thuật toán tạo tổ hợp (Cartesian Product)
    const attributeSets = attributes
      .filter((attr) => attr.attributeValue.length > 0)
      .map((attr) => ({
        name: attr.name,
        values: attr.attributeValue.map((val) => ({
          value: val.value,
          image: val.image || "",
        })),
      }));

    // 3. Thuật toán tạo tổ hợp (Cartesian Product)
    const newVariants = attributeSets.reduce((acc, currentAttr) => {
      if (acc.length === 0) {
        // Trường hợp khởi tạo: tạo biến thể đầu tiên từ thuộc tính đầu tiên
        return currentAttr.values.map((val) => ({
          variantAttributes: [
            {
              attribute: currentAttr.name,
              value: val.value,
              image: val.image, // Kèm theo hình ảnh (nếu có)
            },
          ],
        }));
      } else {
        // Trường hợp kết hợp với các thuộc tính tiếp theo
        return acc.flatMap((existingVariant) => {
          return currentAttr.values.map((currentValue) => ({
            ...existingVariant,
            variantAttributes: [
              ...existingVariant.variantAttributes,
              {
                attribute: currentAttr.name,
                value: currentValue.value,
                image: currentValue.image, // Kèm theo hình ảnh (nếu có)
              },
            ],
          }));
        });
      }
    }, []);

    // 4. Áp dụng các trường dữ liệu mặc định và dữ liệu hiện có (nếu chỉnh sửa)
    const finalVariants = newVariants.map((variant) => {
      // Tạo chuỗi khóa để so sánh với biến thể cũ (ví dụ: 'Màu sắc:Đen;Kích thước:S')
      const key = variant.variantAttributes
        .map((a) => `${a.attribute}:${a.value}`)
        .join(";");

      // Tìm biến thể cũ để giữ lại dữ liệu tồn kho/giá nếu có
      const existingVariant = formData.productVariant.find(
        (oldV) =>
          oldV.variantAttributes
            .map((a) => `${a.attribute}:${a.value}`)
            .join(";") === key
      );

      return {
        price: existingVariant?.price || formData.listPrice || "",
        length: existingVariant?.length || "",
        width: existingVariant?.width || "",
        height: existingVariant?.height || "",
        weight: existingVariant?.weight || "",
        inventory: existingVariant?.inventory || 0,
        variantAttributes: variant.variantAttributes,
      };
    });

    setFormData({ ...formData, productVariant: finalVariants });
    // toast.success(`${finalVariants.length} variants generated successfully!`);
  };
  const getVariantAttributeValue = (variant, attributeName) => {
    const attr = variant.variantAttributes.find(
      (attr) => attr.attribute.toLowerCase() === attributeName.toLowerCase()
    );
    return attr ? attr.value : "-";
  };

  const handleSubmit = () => {
    setSubmitted(true);
    if (!validateForm()) return;

    const productToSave = {
      ...formData,
      // img: formData.coverImage || (formData.imageProduct?.[0] ?? "-"),
      coverImage: formData.coverImage || "",
      imageProduct: formData.imageProduct || [],
      listPrice: Number(formData.listPrice),
      salePrice: Number(formData.salePrice),

      inventory: formData.productVariant.reduce(
        (sum, v) => sum + (Number(v.inventory) || 0),
        0
      ),
      colors:
        formData.attributes
          .find((attr) => attr.name.toLowerCase().includes("color"))
          ?.attributeValue.map((v) => v.value) || [],
      sizes:
        formData.attributes
          .find((attr) => attr.name.toLowerCase().includes("size"))
          ?.attributeValue.map((v) => v.value) || [],
      status:
        formData.productVariant.reduce(
          (sum, v) => sum + (Number(v.inventory) || 0),
          0
        ) > 50
          ? "In stock"
          : formData.productVariant.reduce(
              (sum, v) => sum + (Number(v.inventory) || 0),
              0
            ) > 0
          ? "Low stock"
          : "Out of stock",
    };

    // 2. Gọi API/cập nhật state dựa trên mode
    if (popupMode === "add") {
      // Trong môi trường thực tế, bạn sẽ gọi API POST ở đây
      // Sau đó gọi handleAddProduct(response.data)
      handleAddProduct(productToSave);
    } else {
      // Trong môi trường thực tế, bạn sẽ gọi API PUT ở đây
      // Sau đó gọi handleEditProduct(response.data)
      handleEditProduct(productToSave);
    }

    console.log("JSON gửi API:", productToSave);
  };

  return (
    <div className={container}>
      <div className={header}>
        <div className={title}>
          <h2>Product Management</h2>
          <p>Manage product listings, categories, and inventory.</p>
        </div>
        <Button
          icon={<HiMiniPlus />}
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
            <Input
              placeholder="Search..."
              showIcon={true}
              value={searchIterm}
              onChange={(e) => setSearchIterm(e.target.value)}
            />

            <div className={dropdown}>
              <Button
                content={
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    {getFilterCategoryName()}
                    <RiArrowDropDownLine size={20} />
                  </span>
                }
                isPrimary={false}
                onClick={() => setIsFilterCategoryOpen(!isFilterCategoryOpen)}
              />
              {isFilterCategoryOpen && (
                <div className={classNames(options, categoryPicker)}>
                  <CategoryList
                    categories={categoriesData}
                    selectedCategoryId={filterCategory}
                    onSelect={handleFilterCategorySelect}
                  />
                </div>
              )}
            </div>
          </div>
          <CardContent>
            <table className={table}>
              <thead>
                <tr>
                  {tableHeaders.map((item) => {
                    return <th key={item}>{item}</th>;
                  })}
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((product) => {
                  const colorAttr = product.attributes?.find(
                    (a) =>
                      a.name.toLowerCase() === "màu sắc" ||
                      a.name.toLowerCase() === "color"
                  );
                  const sizeAttr = product.attributes?.find(
                    (a) =>
                      a.name.toLowerCase() === "kích thước" ||
                      a.name.toLowerCase() === "size"
                  );

                  return (
                    <tr key={product.id}>
                      <td>{product.categoryId}</td>
                      <td
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-start",
                          gap: "8px",
                        }}
                      >
                        <img
                          src={
                            product.coverImage ||
                            product.attributes?.[0]?.attributeValue?.[0]
                              ?.image ||
                            ""
                          }
                          alt={product.name}
                          style={{
                            width: 40,
                            height: 40,
                            objectFit: "cover",
                            borderRadius: 6,
                          }}
                        />
                        <span>{product.name}</span>
                      </td>
                      <td>{product.categoryId || "-"}</td>

                      {/* COLOR column */}
                      <td>
                        {colorAttr?.attributeValue?.length > 0
                          ? colorAttr.attributeValue
                              .map((v) => v.value)
                              .join(", ")
                          : "-"}
                      </td>

                      {/* SIZE column */}
                      <td>
                        {sizeAttr?.attributeValue?.length > 0
                          ? sizeAttr.attributeValue
                              .map((v) => v.value)
                              .join(", ")
                          : "-"}
                      </td>

                      <td>{product.listPrice?.toLocaleString() || "-"}</td>
                      <td>{product.salePrice?.toLocaleString() || "-"}</td>

                      {/* Tổng tồn kho */}
                      <td className={getStatusColor(product)}>
                        {getTotalInventory(product)}
                      </td>

                      {/* Trạng thái variant */}
                      <td>{getStatus(product)}</td>

                      {/* Hành động */}
                      <td>
                        <ActionMenu
                          isOpen={isOpenId === product.categoryId}
                          onToggle={() =>
                            setIsOpenId(
                              isOpenId === product.categoryId
                                ? null
                                : product.categoryId
                            )
                          }
                          onClose={() => setIsOpenId(null)}
                          onEdit={() => handletoEditPopup(product)}
                          onDelete={() => handleDeleteProduct(product)}
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
            onConfirm={handleSubmit}
          >
            <h4 style={{ marginBottom: "10px" }}>Basic Information</h4>
            <section className={section} style={{ paddingTop: "15px" }}>
              {/* 2. UPLOAD NHIỀU ẢNH (MULTIPLE IMAGES) */}
              <div className={spaceY2}>
                {/* Preview các ảnh đã upload */}
                {formData.imageProduct.length > 0 && (
                  <div
                    className={preview}
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                      marginTop: "10px",
                    }}
                  >
                    {formData.imageProduct.map((url, index) => (
                      <div
                        key={index}
                        style={{
                          position: "relative",
                          display: "inline-block",
                        }}
                      >
                        <img
                          src={url}
                          alt={`Preview-${index}`}
                          style={{
                            width: "100px",
                            height: "100px",
                            borderRadius: "8px",
                            objectFit: "cover",
                            border: "1px solid #ddd",
                          }}
                        />
                        <button
                          onClick={() => removeImage(index)}
                          style={{
                            position: "absolute",
                            top: -5,
                            right: -5,
                            background: "red",
                            color: "#fff",
                            border: "none",
                            borderRadius: "50%",
                            width: 20,
                            height: 20,
                            cursor: "pointer",
                            lineHeight: "18px",
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
            <div className={uploadBtn}>
              <input
                type="file"
                multiple
                onChange={handleSomeImageChange}
                ref={fileInputSomeImgRef}
                style={{ display: "none" }}
              />
              <div
                className={stylesBtnUpload}
                onClick={handleSomeImgButtonClick}
              >
                <span>
                  <GrFormUpload />
                </span>
                <Button content={"Upload More Images"} isPrimary={false} />
              </div>
            </div>

            <div className={popUpContent}>
              <section className={gridCols2}>
                <div className={spaceY2}>
                  <label>
                    Product Name{" "}
                    <span className={getRequiredClass("name")}>*</span>
                  </label>
                  <Input
                    placeholder="Enter product name..."
                    type="text"
                    name="name"
                    ref={nameRef}
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={spaceY2}>
                  <label>
                    List Price{" "}
                    <span className={getRequiredClass("listPrice")}>*</span>
                  </label>
                  <Input
                    placeholder="429000"
                    type="number"
                    name="listPrice"
                    ref={priceRef}
                    min="0"
                    value={formData.listPrice}
                    onChange={handleInputChange}
                  />
                </div>
              </section>
              <section className={gridCols2} style={{ marginTop: "10px" }}>
                <div className={spaceY2}>
                  <label style={{ display: "block", marginBottom: "5px" }}>
                    Product Category{" "}
                    <span className={getRequiredClass("categoryId")}>*</span>
                  </label>

                  {/* 1. NÚT HIỂN THỊ CATEGORY VÀ KÍCH HOẠT */}
                  <Button
                    content={
                      <span
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        {getSelectedCategoryName()}
                        <RiArrowDropDownLine size={20} />
                      </span>
                    }
                    isPrimary={false}
                    onClick={() =>
                      setIsCategoryPickerOpen(!isCategoryPickerOpen)
                    }
                  />
                  {isCategoryPickerOpen && (
                    <div className={styles.categoryPicker}>
                      {/* Header hiển thị danh mục đang chọn */}
                      <div
                        style={{
                          padding: "8px 10px",
                          backgroundColor: "#f0f0f0",
                          borderBottom: "1px solid #ccc",
                          fontWeight: "bold",
                        }}
                      >
                        Current Selection: {getSelectedCategoryName()}
                      </div>

                      {/* Danh sách Category Tree */}
                      <CategoryList
                        categories={categoriesData}
                        selectedCategoryId={formData.categoryId}
                        onSelect={(cat) => {
                          handleCategorySelect(cat);
                          setIsCategoryPickerOpen(false);
                        }}
                      />
                    </div>
                  )}

                  <input
                    type="hidden"
                    name="categoryId"
                    value={formData.categoryId || ""}
                  />
                  {submitted && !formData.categoryId && (
                    <p style={{ color: "red", fontSize: "0.8em" }}>
                      Please select a category!
                    </p>
                  )}
                </div>
                <div className={spaceY2}>
                  <label>
                    Sale Price{" "}
                    <span className={getRequiredClass("salePrice")}>*</span>
                  </label>
                  <Input
                    placeholder="429000"
                    type="number"
                    name="salePrice"
                    ref={priceRef}
                    min="0"
                    value={formData.salePrice}
                    onChange={handleInputChange}
                  />
                </div>
              </section>
              {/* Attributes */}
              <section className={section}>
                <h4 style={{ marginBottom: "10px" }}>
                  Product Attributes (Color, Size, ...)
                </h4>

                {formData.attributes.map((attribute, attrIndex) => (
                  <div key={attrIndex} className={attributeBlock}>
                    <div className={attributeHeader}>
                      <div className={attributeNameWrapper}>
                        <label>Attribute Name</label>
                        <Input
                          placeholder="Ex: Color, Size, Material..."
                          type="text"
                          value={attribute.name}
                          onChange={(e) =>
                            updateAttribute(attrIndex, "name", e.target.value)
                          }
                        />
                      </div>

                      {/* remove attribute button */}
                      <Button
                        content="Remove Attribute"
                        isPrimary={false}
                        onClick={() => removeAttribute(attrIndex)}
                      />
                    </div>
                    <h5
                      style={{
                        marginTop: "15px",
                        marginBottom: "10px",
                        fontWeight: "normal",
                      }}
                    >
                      Value ({attribute.name || "Value"})
                    </h5>

                    <div className={attributeValueList}>
                      {attribute.attributeValue.map((value, valueIndex) => (
                        <div
                          key={valueIndex}
                          style={{
                            border: "1px solid #eee",
                            padding: "10px",
                            borderRadius: "4px",
                            marginBottom: "8px",
                          }}
                        >
                          <div className={attributeValueItem}>
                            <Input
                              placeholder={`Name ${
                                attribute.name || "value"
                              } (Ex: Red, S)`}
                              type="text"
                              value={value.value}
                              onChange={(e) =>
                                updateAttributeValue(
                                  attrIndex,
                                  valueIndex,
                                  "value",
                                  e.target.value
                                )
                              }
                            />

                            {/* Image Upload */}
                            <Input
                              key={`file-upload-${attrIndex}-${valueIndex}-${value.image}`}
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                {
                                  handleAttributeImageChange(
                                    attrIndex,
                                    valueIndex,
                                    e.target.files[0]
                                  );
                                  // handleCoverImageChange(e);
                                }
                              }}
                            />
                            <div className={preview}>
                              {value.image && (
                                <img
                                  src={value.image}
                                  alt="Swatch Preview"
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    objectFit: "cover",
                                    borderRadius: "4px",
                                    border: "1px solid #ddd",
                                  }}
                                  onClick={() =>
                                    promoteAttributeImageToCover(value.image)
                                  }
                                />
                              )}
                            </div>

                            <Button
                              content="Delete"
                              isPrimary={false}
                              onClick={() =>
                                removeAttributeValue(attrIndex, valueIndex)
                              }
                              className={styles.removeValueButton}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      icon={<HiMiniPlus />}
                      content={`Add Value for ${attribute.name || "Attribute"}`}
                      isPrimary={false}
                      style={{
                        width: "100%",
                        marginTop: "10px",
                        backgroundColor: "#28a745",
                        color: "white",
                      }}
                      onClick={() => addAttributeValue(attrIndex)}
                    />
                  </div>
                ))}

                <Button
                  icon={<HiMiniPlus />}
                  content="Add New Attribute (Ex: Material)"
                  isPrimary={true}
                  style={{ backgroundColor: "#007bff" }}
                  onClick={addAttribute}
                />
              </section>
              <section className={section}>
                <label>Description</label>
                <div className={description}>
                  <textarea
                    placeholder="Enter product description..."
                    name="description"
                    ref={descriptionRef}
                    value={formData.description}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
              </section>
              {/* Variants */}
              <section className={section}>
                <h4 style={{ marginBottom: "10px" }}>
                  Product Variants ({formData.productVariant.length} Variants)
                </h4>
                {/* 
                  <Button
                    showIcon={true}
                    content="Auto Generate/Update Variants"
                    isPrimary={true}
                    style={{
                      width: "100%",
                      marginBottom: "15px",
                      backgroundColor: "#ffc107",
                      color: "#333",
                    }}
                    onClick={generateVariants}
                  /> */}

                {/* Bảng Hiển thị Biến thể */}
                {formData.productVariant.length > 0 && (
                  <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                    <table className={variantTable}>
                      <thead>
                        <tr className={variantTableHeader}>
                          <th>Color</th>
                          <th>Size</th>
                          <th>Price ($)</th>
                          <th>Inventory</th>
                          <th>Weight (g)</th>
                          <th>Height (cm)</th>
                          <th>Width (cm)</th>
                          <th>Length (cm)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.productVariant.map((variant, index) => (
                          <tr key={index}>
                            {/* Tổ hợp Thuộc tính */}
                            <td>
                              {getVariantAttributeValue(variant, "Màu sắc")}
                            </td>
                            {/* Kích thước */}
                            <td>
                              {getVariantAttributeValue(variant, "Kích thước")}
                            </td>
                            {/* Giá */}
                            <td style={{ padding: "4px" }}>
                              <Input
                                type="number"
                                value={variant.price}
                                onChange={(e) => {
                                  const updated = [...formData.productVariant];
                                  updated[index].price = e.target.value;
                                  setFormData({
                                    ...formData,
                                    productVariant: updated,
                                  });
                                }}
                                placeholder="Price"
                              />
                            </td>
                            {/* Tồn kho */}
                            <td style={{ padding: "4px" }}>
                              <Input
                                type="number"
                                value={variant.inventory}
                                onChange={(e) => {
                                  const updated = [...formData.productVariant];
                                  updated[index].inventory =
                                    parseInt(e.target.value) || 0;
                                  setFormData({
                                    ...formData,
                                    productVariant: updated,
                                  });
                                }}
                                placeholder="Inventory"
                              />
                            </td>
                            {/* Cân nặng */}
                            <td style={{ padding: "4px" }}>
                              <Input
                                type="number"
                                value={variant.weight}
                                onChange={(e) => {
                                  const updated = [...formData.productVariant];
                                  updated[index].weight = e.target.value;
                                  setFormData({
                                    ...formData,
                                    productVariant: updated,
                                  });
                                }}
                                placeholder="Weight"
                              />
                            </td>
                            {/* Chiều cao */}
                            <td style={{ padding: "4px" }}>
                              <Input
                                type="number"
                                value={variant.height}
                                onChange={(e) => {
                                  const updated = [...formData.productVariant];
                                  updated[index].height = e.target.value;
                                  setFormData({
                                    ...formData,
                                    productVariant: updated,
                                  });
                                }}
                                placeholder="Height"
                              />
                            </td>
                            {/* Chiều rộng */}
                            <td style={{ padding: "4px" }}>
                              <Input
                                type="number"
                                value={variant.width}
                                onChange={(e) => {
                                  const updated = [...formData.productVariant];
                                  updated[index].width = e.target.value;
                                  setFormData({
                                    ...formData,
                                    productVariant: updated,
                                  });
                                }}
                                placeholder="Width"
                              />
                            </td>
                            {/* Chiều dài */}
                            <td style={{ padding: "4px" }}>
                              <Input
                                type="number"
                                value={variant.length}
                                onChange={(e) => {
                                  const updated = [...formData.productVariant];
                                  updated[index].length = e.target.value;
                                  setFormData({
                                    ...formData,
                                    productVariant: updated,
                                  });
                                }}
                                placeholder="Length"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </div>
          </PopUp>
        </div>
      </Card>
    </div>
  );
}

export default Products;

// thieu height, width, length trong variant, pricesale, nhieu hinh anh trong san pham, sua hinh anh hien thi o table
// chua hien thi duoc category trong table
