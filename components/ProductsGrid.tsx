import React from 'react'

function ProductsGrid({ products }: { products: any[] }) {
  return (
    <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((p) => (
            <div
            key={p.id}
            className="bg-white border rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition"
            >
                <img
                    src={p.image}
                    alt={p.name}
                    className="h-40 w-full object-cover"
                />
                <div className="p-4">
                    <h2 className="text-lg font-semibold">{p.name}</h2>
                    <p className="text-slate-500 text-sm mt-1">Composition: {p.composition}</p>

                    <div className="flex items-center justify-between mt-3">
                    <span className="font-bold">Rate : ₹{p.rate}</span>
                    {/* SECTION TO ENABLE STOCK */}
                    {/* <span
                        className={`text-sm ${
                        p.stock > 100 ? "text-green-600" : "text-red-600"
                        }`}
                    >
                        {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                    </span> */}
                    </div>
                    <div className="flex flex-col justify-between mt-1">
                        <span className="font-medium text-red-600">Old MRP : ₹{p.oldMRP}</span>
                        <span className="font-medium text-green-600">New MRP : ₹{p.newMRP}</span>
                    </div>

                    <p className="text-sm text-slate-600 mt-3 line-clamp-2">
                    {p.description}
                    </p>
                    
                    {/* Button Section for Some Action */}
                    {/* <button className="mt-4 w-full bg-sky-500 text-white py-2 rounded-lg hover:bg-sky-600">
                    View Details
                    </button> */}
                </div>
            </div>
        ))}
    </section>
  )
}

export default ProductsGrid