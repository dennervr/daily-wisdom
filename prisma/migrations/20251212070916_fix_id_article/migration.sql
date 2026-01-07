-- AlterTable
CREATE SEQUENCE articles_id_seq;
ALTER TABLE "articles" ALTER COLUMN "id" SET DEFAULT nextval('articles_id_seq');
ALTER SEQUENCE articles_id_seq OWNED BY "articles"."id";
