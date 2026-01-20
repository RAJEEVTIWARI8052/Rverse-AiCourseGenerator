export async function POST(req, { params }) {
  const { courseId } = await params;
  try {
    const deleted = await db.delete(Chapters).where(eq(Chapters.courseId, courseId));
    console.log(`Deleted ${deleted.length} chapters`);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Error clearing chapters:", err);
    return new Response(JSON.stringify({ error: "Failed to clear chapters" }), { status: 500 });
  }
}
