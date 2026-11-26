import { NextRequest, NextResponse } from 'next/server';
import { productFirestore } from '@/lib/firebase-admin';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await productFirestore.delete(id);
    return NextResponse.json({
      success: true,
      message: 'Producto eliminado de Firestore',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({
      success: false,
      error: 'Error al eliminar producto: ' + (error as Error).message,
    }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const product = await productFirestore.getById(id);
    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({
      success: false,
      error: 'Error al obtener producto: ' + (error as Error).message,
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const updatedProduct = await productFirestore.update(id, body);
    return NextResponse.json({
      product: updatedProduct,
      success: true,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({
      success: false,
      error: 'Error al actualizar producto: ' + (error as Error).message,
    }, { status: 500 });
  }
}
