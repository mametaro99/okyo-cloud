# お経クラウド

## 工夫したところ

### 各お経のフレーズの順番を扱うデータ構造について、計算量や実装の容易さを考慮して実装したこと
お経の句の順番(OkyoPhrase.order)の並び替えを管理するデータ構造について、以下のブログを参考に実装。


[並べ替えできるデータをデータベースに保存する方法_zenn_Nakamura](https://zenn.dev/itte/articles/e97002637cd3a6#%E6%96%B9%E6%B3%952-%E3%83%AC%E3%82%B3%E3%83%BC%E3%83%89%E3%81%AB%E8%A1%A8%E7%A4%BA%E5%84%AA%E5%85%88%E5%BA%A6%E3%82%92%E6%8C%81%E3%81%9F%E3%81%9B%E3%82%8B)

[方法1 (レコードに自身の順番を持たせる)](https://zenn.dev/itte/articles/e97002637cd3a6#%E6%96%B9%E6%B3%951-%E3%83%AC%E3%82%B3%E3%83%BC%E3%83%89%E3%81%AB%E8%87%AA%E8%BA%AB%E3%81%AE%E9%A0%86%E7%95%AA%E3%82%92%E6%8C%81%E3%81%9F%E3%81%9B%E3%82%8B)と、[方法6 (レコードの順序を配列として保存する)](https://zenn.dev/itte/articles/e97002637cd3a6#%E6%96%B9%E6%B3%956-%E3%83%AC%E3%82%B3%E3%83%BC%E3%83%89%E3%81%AE%E9%A0%86%E5%BA%8F%E3%82%92%E9%85%8D%E5%88%97%E3%81%A8%E3%81%97%E3%81%A6%E4%BF%9D%E5%AD%98%E3%81%99%E3%82%8B)のどちらを実装するかについて順番のデータの更新における計算量や実装の容易さで、迷ったものの以下の点で方法１を採用。



1. 順番データの更新/データ取得において、どちらも計算量は変わらない。新しい順番の更新の際も、方法6/方法1も配列/レコードから、挿入した順番から挿入する前の順番までの値を一つづつ、更新する必要がある。
2. データの削除において、方法6(レコードの順序を配列として保存する)は、並び替えの順序を扱っている配列から、データ量だけ探索して削除する必要があるが、方法1は一つのデータ削除で済むことから、方法1の方が優位である
3. 実装の容易性について、方法6(レコードの順序を配列として保存する)は、
   配列を扱っており、[RDBではレコードに配列型を扱うことは望ましいことではなく](https://products.sint.co.jp/topsic/blog/database-design-anti-pattern#:~:text=%E3%81%9F%E3%82%82%E3%81%AE%E3%81%A7%E3%81%99%E3%80%82-,%E3%82%A2%E3%83%B3%E3%83%81%E3%83%91%E3%82%BF%E3%83%BC%E3%83%B3(1)%20%E9%85%8D%E5%88%97%E3%83%87%E3%83%BC%E3%82%BF%E3%82%92%E4%BF%9D%E6%8C%81%E3%81%99%E3%82%8B,-RDBMS%E3%81%AE%E5%9F%BA%E6%9C%AC)、とくに今回のお経のフレーズ（OKyoPrase)を配列の要素として管理するようにしてしまうと、以下のような２つの実装の手間が発生する。
- OkyoPraseを削除した場合に、順序を扱っている配列から、削除するOkyoPraseのIDを同時に削除しないといけない
- データを取り出す際に、順序を扱っている配列のお経フレーズのIDを、OkyoPraseのテーブルの所有するIDと結合する必要がある。

上記のように、RDBで配列型を扱う場合（[とくに配列型に、その他のテーブルのIDを扱う場合](https://techracho.bpsinc.jp/hachi8833/2023_06_08/48322#:~:text=%E3%83%86%E3%83%BC%E3%83%96%E3%83%AB%E3%81%8CID%E3%82%84%E9%96%A2%E9%80%A3%E4%BB%98%E3%81%91%E3%81%A8%E4%B8%80%E5%88%87%E9%96%A2%E3%82%8F%E3%82%8A%E3%82%92%E6%8C%81%E3%81%9F%E3%81%AA%E3%81%84%E3%81%93%E3%81%A8%E3%81%8C%E3%82%8F%E3%81%8B%E3%81%A3%E3%81%A6%E3%81%84%E3%82%8B%E5%A0%B4%E5%90%88)）は、手間がかかる。また、方法6として、並び替えの順番が格納されている配列をKVS(キーバリューストア)で扱うことも考えられるが、並び替えの順番を扱う配列にその他のテーブル（お経フレーズ）のIDを扱うため、削除＆表示があった時に、テーブルの結合に時間がかかってしまう。また、方法6(レコードの順序を配列として保存する方法)は、別のテーブルを用意したりKVSなどの技術を使うため、方法1のレコードに自身の順番を持たせるだけの実装に比べて実装コストがかかってしまう。このことから、実装では方法6より方法1の方が、容易である。