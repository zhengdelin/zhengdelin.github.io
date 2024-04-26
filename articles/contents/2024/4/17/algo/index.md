# 演算法期中考練習2024 - 解

1. Please show the shortest paths from **V4** to other nodes in the following graph by Dijkstra’s Algorithm. (20pts) (Note: Detailed steps are required; otherwise, you will get zero point.) 

![1.png](%E6%BC%94%E7%AE%97%E6%B3%95%E6%9C%9F%E4%B8%AD%E8%80%83%E7%B7%B4%E7%BF%922024%20-%20%E8%A7%A3%20bd5755da4d1b417fb5415b3dcf5b0901/1.png)

---

| S | V - S | V0 | V1  | V2 | V3 | V5 |
| --- | --- | --- | --- | --- | --- | --- |
| V4 | V0V1V2V3V5 | INF | INF | INF | 30
(V4V3) | INF |
| V3V4 | V0V1V2V5 | INF | 50
(V4V3V1) | INF |  | INF |
| V1V3V4 | V0V2V5 | INF |  | 65
(V4V3V1V2) |  | INF |
| V1V2V3V4 | V0V5 | 85
(V4V3V1V2V0) |  |  |  | INF |
| V0V1V2V3V4 | V5 |  |  |  |  | INF |
| V0V1V2V3V4V5 |  |  |  |  |  |  |

1. (a) Give the definition of 0/1 Knapsack problem. (10pt) (b) Give a greedy algorithm to solve 0/1 Knapsack problem. (10pt) (c) Give an example to show your algorithm may not get the optimal solution when solving 0/1 Knapsack problem. (10pts)
    
    ---
    
    1. 給定n個物體，每個物體有與之相關的的重量 $w_i > 0$及利潤 $p_i>0$。背包總重量為 $M$，目標為將物體放入背包中，使得他們的總價值為最大。請注意，只能選擇將物體完全放入背包中或是不放入。 可以用此數學表達式來表達本題目：
    Maximize $\sum_{i=1}^n p_i x_i$ subject to $\sum_{i=1}^n w_i x_i \leq M$ and $x_i \in \lbrace0, 1\rbrace$
    2. Algorithm:
    Step 1: 將 $p_i$ / $w_i$ 排序非遞增順序
    Step 2: 將物體依照排序後的順序依次放入背包，直到放不下為止
    3. 反例：
    $M=7,\; p_i=(3, 4, 6),\; w_i=(3, 4, 5)$
    Step 1: 排序後 $p_i=(6, 4, 3),\; w_i=(5, 4, 3)$
    Step 2: 放入物體1，此時總利潤為6，背包剩餘重量為2，此時物體2、物體3已經放不進去了，因此最解為放入物體1，最大價值為6
    
    然而此題的解為放入物體2、物體3，最大價值為3+4=7
2. Please find MST of the following graph. (a) Prim’s algorithm (15pt) (b) Kruskal’s algorithm  (15pts)
    
    ![3.png](%E6%BC%94%E7%AE%97%E6%B3%95%E6%9C%9F%E4%B8%AD%E8%80%83%E7%B7%B4%E7%BF%922024%20-%20%E8%A7%A3%20bd5755da4d1b417fb5415b3dcf5b0901/3.png)
    
    ---
    
    1. Prim
        
        
        | A | B | 比較的邊 |
        | --- | --- | --- |
        | {1} | {2, 3, 4, 5, 6} | (1, 2) 10 (1, 4) 30 (1, 5) 45 |
        | {1, 2} | {3, 4, 5, 6} | (1, 4) 30 (1, 5) 45 (2, 5) 40 (2, 3) 50 (2, 6) 25 |
        | {1, 2, 6} | {3, 4, 5} | (1, 4) 30 (1, 5) 45 (2, 5) 40 (2, 3) 50
        (6, 4) 20 (6, 5) 55 (6, 3) 15 |
        | {1, 2, 3, 6) | {4, 5} | (1, 4) 30 (1, 5) 45 (2, 5) 40 (6, 4) 20 (6, 5) 55
        (3, 5) 35 |
        | {1, 2, 3, 4, 6} | {5} | (1, 5) 45 (2, 5) 40 (6, 5) 55 (3, 5) 35 |
        | {1, 2, 3, 4, 5, 6} | {} |  |
    2. Kruskal
        
        ![3-2.png](%E6%BC%94%E7%AE%97%E6%B3%95%E6%9C%9F%E4%B8%AD%E8%80%83%E7%B7%B4%E7%BF%922024%20-%20%E8%A7%A3%20bd5755da4d1b417fb5415b3dcf5b0901/3-2.png)
        
    
3. Indicate when we can say a designed algorithm is optimal for a given problem. (10 pts)
    
    ---
    
    當 lower bound 與該演算法的 time complexity 相同時，則我們可以稱這個演算法為最佳的演算法。
    
4. When the lower bound of a given problem and the upper bound of the designed algorithm are different, there exist three possible cases. Please show what they are. (15pts)
    
    ---
    
    1.  可能存在更高的 lower bound
    2.  可能存在更好的演算法
    3.  lower bound 和演算法都有改進的空間
    
5. Please give the definition of $f(n) = O(g(n))$. (10pts)
    
    ---
    
    $\exist\ c, n_0 \ni |f(n)| \le c|g(n)| \quad \forall\; n \ge n_0$
    對於函數 $f(n)$ 和 $g(n)$，存在一些常數 $c$ 和 $n_0$，使得所有對於 $n$ 大於或等於 $n_0$ 的情況下， $f(n)$ 的絕對值都小於 $c \ · g(n)$。
    
6. Please show how to merge two sorted lists $L_1$ and $L_2$ into one sorted list consisting of elements in $L_1$ and $L_2$ without sorting. The detailed pseudocode is needed. Note that you should define input and output as well. (15pts)
    
    ---
    
    Input: 兩個排序過的列表, $L_1 = ( a_1,\ a_2,\ …,\ a_{n1})$ 以及 $L_2 = (b_1,\ b_2,\ …,\ b_{n2})$
    output: 一個包含 $L_1$ 以及 $L_2$ 的元素的排序過的列表
    algorithm: 
    
    開始
       i = 1
       j = 1
      do 
          比較 $a_i$ 和 $b_j$
          如果 $a_i \gt b_j$ 則輸出 $b_j$ 且 j = j+1
                                 否則輸出 $a_i$ 且 i = i+1
      while ( $i \le n1$ and $j\le n2$ )
      如果 $i \gt n1$ 則輸出 $b_j,\ b_{j+1},\ …,\ b_{n2}$
                            否則輸出 $a_i,\ a_{i+1},\ …,\ a_{n1}$
    結束
    
    Begin
       i = 1
       j = 1
      do
          compare $a_i$ and $b_j$
          if $a_i \gt b_j$ then output $b_j$ and j = j+1
                            else output $a_i$ and i = i+1
      while ( $i \le n1$ and $j\le n2$ )
      if $i \gt n1$ then output $b_j,\ b_{j+1},\ …,\ b_{n2}$
                       else outout $a_i,\ a_{i+1},\ …,\ a_{n1}$
    End
    
7. The following figure is an illustration of multi-stage graph. First, give the definition of Problem “Find a shortest path from $v_0$ to $v_3$ in a multi-stage graph. Second, explain why greedy method cannot obtain the optimal solution with an example. (15pts)   
    
    ![8.png](%E6%BC%94%E7%AE%97%E6%B3%95%E6%9C%9F%E4%B8%AD%E8%80%83%E7%B7%B4%E7%BF%922024%20-%20%E8%A7%A3%20bd5755da4d1b417fb5415b3dcf5b0901/8.png)
    
    ---
    
    使用 Greedy 所得出的解答： $V_0V_{1,2}V_{2,1}V_3$ = 23
    最佳路徑： $V_0V_{1,1}V_{2,2}V_3$ = 7
    因此 Greedy 不適用
    
8. When we want to find the *k*-th smallest number in a set $S$ of *n* numbers, a pivot $P$ is chosen to divide the set $S$ into three sets $S_1$, $S_2$, and $S_3$. Please show why there are at least 1/4 of $S$ known to be less ( greater) than or equal to *P*. (15pts)
    
    ---
    
    在我們找出 P 的過程中，首先，我們會先將 $S$ 分為 $\lceil n/5 \rceil$個子集合，每個子集合包含5個元素，最後一個子集合如果不足 5 個元素，將會補上 $\infin$，然後我們將會排序每個子集合的元素，之後我們會找到 P，P 為所有子集合的中位數所組成的集合的中位數。
    
    由於這種選擇方式使得，至少有一半的子集合的中位數會小於等於 P，而每個子集合的中位數又會至少大於等於該子集合一半的數，因此小於等於P的元素個數至少為 1/4；至少有一半的子集合的中位數會大於等於P，而每個子集合的中位數又會至少小於等於該子集合一半的數，因此大於等於P的元素個數至少為 1/4
    
9. Please give the Huffman codes of the following symbols: A, B, C, D, E, F, G of frequency 9, 3, 5, 8, 13, 10, 18, respectively. (15pts) (Note that the detailed steps are required; otherwise, you will get zero point.)
    
    ---
    
    symbols: A, B, C, D, E, F, G
    freq       : 9, 3, 5, 8, 13, 10, 18
    
    ![10.png](%E6%BC%94%E7%AE%97%E6%B3%95%E6%9C%9F%E4%B8%AD%E8%80%83%E7%B7%B4%E7%BF%922024%20-%20%E8%A7%A3%20bd5755da4d1b417fb5415b3dcf5b0901/10.png)
    
    A: 110
    B: 0100
    C: 0101
    D: 011
    E: 00
    F: 111
    G: 10
    
10. When we want to find the *k*-th smallest number in a set $S$ of *n* numbers, a pivot $P$ is chosen to divide the set $S$ into three sets $S1$, $S2$, and $S3$, where $S1={ a_i | a_i < P , 1 \le i \le n}$, $S2={ a_i | a_i = P , 1 \le i \le n}$, and $S3={a_i | a_i > P , 1 \le i \le n}$. Show what to do in the following three cases: (1) $|S1| \ge k$, (2) $|S1| < k$ and $|S1| + |S2| \ge k$, and (3) $|S1| + |S2|< k$. (10 pts)
    
    ---
    
    1. 這表示 $S1$ 中有足夠的數字小於 $P$，因此我們只要在下一輪中在 $S1$ 中搜尋第 $k$ 小的數字就好
    2. 這表示 $S1$ 中沒有足夠的數字，但 $S1$ 和 $S2$ 的數字至少有 $k$ 個，也就是說 $P$ 就在 $S2$ 中， $P$ 就是第 $k$ 小的數字
    3. 這表示 $S1$ 和 $S2$ 中的數字加起來不到 $k$ 個， 接下來需要在 $S3$ 中找第 $k$ 小的值，我們必須更新 $k$ 為 $k - |S1| - |S2|$
    
11. Please show the increasing order of the following common computing time functions: 
$O(n)$, $O(2^n)$, $O(1)$, $O(log n)$, $O(n log n)$ , $O(n^2)$, $O(n!)$  (5pts)
    
    ---
    
    $O(1) < O(log n) < O(n) < O(n log n)  < O(n^2) < O(2^n) < O(n!)$
    
12. Show that if $T(n) = aT(\frac{n}{b}) + n^c$, then for $n$ a power of $b$ and $T(1)=k$,
$T(n)= ka^{log_bn} + n^c(\frac{b^c}{a-b^c})[(\frac{a}{b^c})^{log_bn}-1]$.
    
    ---
    
    ![13.jpg](%E6%BC%94%E7%AE%97%E6%B3%95%E6%9C%9F%E4%B8%AD%E8%80%83%E7%B7%B4%E7%BF%922024%20-%20%E8%A7%A3%20bd5755da4d1b417fb5415b3dcf5b0901/13.jpg)
    
13. Given the following max heap. As we know, heap can be used to sort numbers. Please show the detailed steps of how to restore the heap after the root 51 is output.
    
    ![14.png](%E6%BC%94%E7%AE%97%E6%B3%95%E6%9C%9F%E4%B8%AD%E8%80%83%E7%B7%B4%E7%BF%922024%20-%20%E8%A7%A3%20bd5755da4d1b417fb5415b3dcf5b0901/14.png)
    
    ---
    
    輸出最大值，並將最小的元素取出補上位置，然後一步步還原 Max heap
    
    ![14-2.png](%E6%BC%94%E7%AE%97%E6%B3%95%E6%9C%9F%E4%B8%AD%E8%80%83%E7%B7%B4%E7%BF%922024%20-%20%E8%A7%A3%20bd5755da4d1b417fb5415b3dcf5b0901/14-2.png)
    
14. 2-D ranking finding problem can be solved by divide-and-conquer strategy. The following graph is an illustration of the solutions of two sub-problems. Please show the detailed steps of how to merge these two solutions in plane A and B to get the final solution. (15pts) (hint: sorting)
    
    ![15.jpg](%E6%BC%94%E7%AE%97%E6%B3%95%E6%9C%9F%E4%B8%AD%E8%80%83%E7%B7%B4%E7%BF%922024%20-%20%E8%A7%A3%20bd5755da4d1b417fb5415b3dcf5b0901/15.jpg)
    
    ---
    
    將A與B的點合併起來，然後依照y點排序，之後更新B點的排名
    假設A、B的點由上至下為 $A_1, A_2, A_3, A_4, B_1, B_2, B_3, B_4, B_5$
    依照 y 排序後，順序為 $B_1, A_1, B_2, B_3, A_2, B_4, A_3, B_5, A_4$
    y 比 $B_1$ 小的 $A$ 點有 $A_1, A_2, A_3, A_4$ ,
    $rank(B_1)$ = 2 + 4 = 6
    y 比 $B_2$ 小的 $A$ 點有 $A_2, A_3, A_4$
    $rank(B_2)$ = 2 + 3 = 5
    y 比 $B_3$ 小的 $A$ 點有 $A_2, A_3, A_4$ ,
    $rank(B_3)$ = 1 + 3 = 4
    y 比 $B_4$ 小的 $A$ 點有 $A_3, A_4$ ,
    $rank(B_4)$ = 0 + 2 = 2
    y 比 $B_5$ 小的 $A$ 點有 $A_4$ ,
    $rank(B_5)$ = 0 + 1 = 1
    
15. Given the sequence 1, 5, 9, 3, 4, 2. Please use straight insertion sort to get the sorted sequence in increasing order. The detailed steps are required; otherwise, you will get zero point.
    
    ---
    
    ![16.png](%E6%BC%94%E7%AE%97%E6%B3%95%E6%9C%9F%E4%B8%AD%E8%80%83%E7%B7%B4%E7%BF%922024%20-%20%E8%A7%A3%20bd5755da4d1b417fb5415b3dcf5b0901/16.png)