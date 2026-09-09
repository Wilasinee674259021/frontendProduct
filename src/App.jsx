import "./App.css";
import { useState, useEffect } from "react";
import { Package, Pencil, Trash2, PlusCircle } from "lucide-react";

function App() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const fetchProduct = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("ไม่สามารถดึงข้อมูลได้");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    //fetch data from API
    fetchProduct();
  }, []);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!name || !price) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name, price: Number(price) }),
      });
      if (!response.ok) throw new Error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      setName("");
      setPrice("");
      fetchProduct();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!name || !price) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name, price: Number(price) }),
      });
      if (!response.ok) throw new Error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.id === editingId
            ? { ...product, name, price: Number(price) }
            : product,
        ),
      );
      setName("");
      setPrice("");
      setEditingId(null);
    } catch (error) {
      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const startEditing = (product) => {
    setEditingId(product.id);
    setName(product.name);
    setPrice(product.price);
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm("คุณต้องการลบสินค้านี้ใช่หรือไม่?")) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("เกิดข้อผิดพลาดในการลบข้อมูล");
      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (error) {
      alert(error.message);
    }
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setEditingId(null);
  };

  return (
    <main className="min-h-screen bg-base-200 px-4 py-6 text-base-content sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <header className="rounded-box border border-base-300 bg-base-100 p-6 text-base-content shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="grid size-12 place-items-center rounded-2xl bg-primary/20 text-primary">
                <Package className="size-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-base-content sm:text-3xl">
                    Product Management System
                  </h1>
                  <span className="badge badge-primary badge-outline text-xs">
                    Product
                  </span>
                </div>
                <p className="mt-1 text-sm text-base-content/70">
                  จัดการสินค้าและราคาได้อย่างรวดเร็วในที่เดียว
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Form Section */}
        <section className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body p-5 sm:p-6">
            <div className="mb-2 flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-2 text-primary">
                <PlusCircle className="size-5" />
              </div>
              <div>
                <h2 className="card-title text-xl text-base-content">
                  {editingId ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
                </h2>
                <p className="text-sm text-base-content/70">
                  กรอกข้อมูลเพื่อ{editingId ? "อัปเดต" : "เพิ่ม"}
                  รายการเข้าสู่ระบบ
                </p>
              </div>
            </div>

            <form
              className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-[1fr_0.65fr_auto_auto] md:items-end"
              onSubmit={editingId ? handleUpdateProduct : handleCreateProduct}
            >
              <label className="form-control w-full">
                <span className="label-text mb-2 font-medium text-base-content">
                  ชื่อสินค้า
                </span>
                <input
                  className="input input-bordered w-full bg-base-200 text-base-content"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="เช่น Gaming keyboard"
                />
              </label>

              <label className="form-control w-full">
                <span className="label-text mb-2 font-medium text-base-content">
                  ราคา (บาท)
                </span>
                <input
                  className="input input-bordered w-full bg-base-200 text-base-content"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="เช่น 1500"
                />
              </label>

              <button
                className="btn btn-primary w-full md:w-auto"
                type="submit"
                disabled={submitting}
              >
                <Pencil className="size-4" />
                {editingId ? "อัปเดตข้อมูล" : "บันทึกข้อมูล"}
              </button>

              {editingId && (
                <button
                  className="btn btn-ghost w-full md:w-auto text-base-content"
                  type="button"
                  onClick={resetForm}
                >
                  ยกเลิก
                </button>
              )}
            </form>
          </div>
        </section>

        {/* Alert Error */}
        {error && (
          <div className="alert alert-error shadow-sm">
            <span>เกิดข้อผิดพลาด: {error}</span>
          </div>
        )}

        {/* Main Content Section */}
        <section className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body p-0">
            <div className="flex items-center justify-between border-b border-base-300 px-5 py-5 sm:px-6">
              <div>
                <h2 className="card-title text-base-content">
                  รายการสินค้าทั้งหมด
                </h2>
                <p className="text-sm text-base-content/70">
                  มีสินค้า {products.length} รายการ
                </p>
              </div>
              <span className="badge badge-primary badge-lg">
                {products.length}
              </span>
            </div>

            {loading ? (
              <div className="flex min-h-48 items-center justify-center">
                <span className="loading loading-dots loading-lg text-primary" />
              </div>
            ) : products.length === 0 ? (
              <div className="py-14 text-center">
                <Package className="mx-auto size-12 text-base-content/30" />
                <h2 className="mt-2 text-lg font-semibold text-base-content">
                  ยังไม่มีข้อมูลสินค้า
                </h2>
                <p className="text-sm text-base-content/70">
                  เริ่มต้นด้วยการเพิ่มสินค้าใหม่ด้านบน
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full text-base-content">
                  <thead>
                    <tr className="text-base-content/70">
                      <th>รหัส</th>
                      <th>สินค้า</th>
                      <th>ราคา</th>
                      <th className="text-right">การจัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((item) => (
                      <tr key={item.id}>
                        <td className="font-mono text-xs text-base-content/60">
                          #{item.id}
                        </td>
                        <td className="font-medium text-base-content">
                          {item.name}
                        </td>
                        <td className="font-bold text-success">
                          {Number(item.price).toLocaleString()} ฿
                        </td>
                        <td className="text-right">
                          <button
                            onClick={() => startEditing(item)}
                            className="btn btn-square btn-ghost btn-sm text-warning hover:bg-warning/10"
                          >
                            <Pencil className="size-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(item.id)}
                            className="btn btn-square btn-ghost btn-sm text-error hover:bg-error/10"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
export default App;
