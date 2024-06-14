## AUTH

/auth/register -> POST REGISTER ACCOUNT
/auth/login -> POST LOGIN ACCOUNT

## USERS MANAGEMENT

/users/user?id= -> GET USER BY ID
/users/ -> GET ALL USERS
/users/ -> DELETE USER BY ID
/users/update -> UPDATE USER BY ID

## Products Management

/products -> GET ALL PRODUCTS
/products/add -> POST ADD PRODUCT
/products/upload/{productId} -> POST UPLOAD IMAGE FOR PRODUCT ID
/products/update -> PUT UPDATE PRODUCT

## Orders Management

/orders -> GET ALL ORDERS
/orders/add -> POST GENERATE ORDER
/orders/update/{id} -> PUT UPDATE ORDER

# Categorys Management
/category -> GET ALL CATEGORYS
/category/add -> ADD NEW CATEGORY
/category/update -> UPDATE CATEGORY (CREATE IF NO EXIST)
/cateogry/delete -> DELETE CATEGORY AND PRODUCTS FOR THIS CATEGORY.