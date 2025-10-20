import HeaderCommon from "@layout/HeaderCommon/HeaderCommon";
import Card from "@components/Card/Card";
import CardHeader from "@components/Card/CardHeader/CardHeader";
import CardContent from "@components/Card/CardContent/CardContent";
import styles from "./styles.module.scss";
import { productData, tableHeaders } from "./constants";
import { useState } from "react";
import Button from "@components/ui/Button/Button";
import Input from "@components/ui/Input/Input";
import ActionMenu from "../../components/ui/ActionMenu/ActionMenu";
import { RiArrowDropDownLine } from "react-icons/ri";
function Products() {
  const {
    container,
    containerCard,
    headerCard,
    table,
    popUpTitle,
    popUpcontent,
    containerlstBtn,
    lstBtn,
    findContainer,
    selectWrapper,
    selectCustom,
    options,
    dropdown,
    img,
  } = styles;

  const [popUp, setPopup] = useState(false);

  const [isOpenId, setIsOpenId] = useState(null);

  const [open, setOpen] = useState(false);
  const optionsCategory = ["All", "Jeans", "Shirt", "Shoes"];

  const [filterCategory, setFilterCategory] = useState("All");

  const dataStatus = [
    { status: "All" },
    { status: "In stock" },
    { status: "Low stock" },
    { status: "Out of stock" },
  ];
  const [filterStatus, setFilterStatus] = useState("All");

  // lọc dữ liệu sản phẩm theo danh mục
  // const filteredProducts =
  //   filterCategory === "All"
  //     ? productData
  //     : productData.filter(
  //         (product) =>
  //           product.category.toLowerCase() === filterCategory.toLowerCase()
  //       );

  // lọc dữ liệu sản phẩm theo trạng thái
  // const filteredProductsByStatus =
  //   filterStatus === "All"
  //     ? productData
  //     : productData.filter(
  //         (product) =>
  //           product.status.toLowerCase() === filterStatus.toLowerCase()
  //       );

  // lọc danh mục(category) và trạng thái(status)
  const filteredProducts = productData.filter((product) => {
    const category =
      filterCategory === "All" ||
      product.category.toLowerCase() === filterCategory.toLowerCase();

    const status =
      filterStatus === "All" ||
      product.status.toLowerCase() === filterStatus.toLowerCase();

    return category && status;
  });

  return (
    <div className={container}>
      <HeaderCommon showAddButton={true} />
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
            <Input content="Search..." />
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
                {filteredProducts.map((product) => {
                  return (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>
                        <span>{product.img}</span>
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
                        {/* {product.actions.map((action) => (
                          <button key={action}>{action}</button>
                        ))} */}
                        <ActionMenu
                          isOpen={isOpenId === product.id}
                          onToggle={() =>
                            setIsOpenId(
                              isOpenId === product.id ? null : product.id
                            )
                          }
                          onClose={() => setIsOpenId(null)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </div>
      </Card>

      <div>
        <div className={popUpTitle}>
          <h4>Add new product</h4>
          <p>Enter the product information to be added to the inventory.</p>
        </div>
        <div className={popUpcontent}>
          <div>
            <div>
              <div>
                <label>ID</label>
                <input type="text" />
              </div>
              <div>
                <label>Product Name</label>
                <input type="text" />
              </div>
            </div>
            <div>
              <div>
                <label>Category</label>
                <Button content={"Select category"} isPrimary={false} />
              </div>
              <div>
                <label>Price</label>
                <input type="text" />
              </div>
            </div>
            <div>
              <label>Inventory</label>
              <input type="text" />
            </div>
            <div>
              <label>Colors</label>
              <input type="text" />
            </div>
            <div>
              <label>Sizes</label>
              <input type="text" />
            </div>
            <div className={img}>
              <div>
                <label>Image</label>
                <div>
                  <input type="file" />
                  <Button content={"Upload"} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;
