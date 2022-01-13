import { useTransition, useActionData, Form, redirect } from "remix";
import type { ActionFunction } from "remix";
import { createPost } from "~/post";
import invariant from "tiny-invariant";

type PostError = {
  title?: boolean;
  slug?: boolean;
  markdown?: boolean;
};

export const action: ActionFunction = async ({ request }) => {
  // 로딩 스피너를 보기 위해 추가한 코드
  await new Promise((res) => setTimeout(res, 1000));

  const formData = await request.formData();

  // formik처럼 dom의 name기준으로 값을 가져옴
  const title = formData.get("title");
  const slug = formData.get("slug");
  const markdown = formData.get("markdown");

  const errors: PostError = {};
  if (!title) errors.title = true;
  if (!slug) errors.slug = true;
  if (!markdown) errors.markdown = true;

  if (Object.keys(errors).length) {
    return errors;
  }

  // typecheck
  invariant(typeof title === "string");
  invariant(typeof slug === "string");
  invariant(typeof markdown === "string");

  await createPost({ title, slug, markdown });

  return redirect("/admin");
};

export default function NewPost() {
  // 위의 action을 통해 나온 결과
  const errors = useActionData();
  // 페이지 트랜지션과 관련한 모든 정보
  const transition = useTransition();

  return (
    <Form method="post">
      <p>
        <label>
          Post Title: {errors?.title ? <em>Title is required</em> : null}
          <input type="text" name="title" />
        </label>
      </p>
      <p>
        <label>
          {errors?.slug ? <em>Slug is required</em> : null}
          Post Slug: <input type="text" name="slug" />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">Markdown:</label>
        {errors?.markdown ? <em>Markdown is required</em> : null}
        <br />
        <textarea id="markdown" rows={20} name="markdown" />
      </p>
      <p>
        <button type="submit">
          {transition.submission ? "Creating..." : "Create Post"}
        </button>
      </p>
    </Form>
  );
}
